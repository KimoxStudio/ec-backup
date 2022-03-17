import * as pm2 from 'pm2';
import * as scheduler from 'node-cron';
import { Command, Option } from 'commander';
import { ValidateConfigCliCommand } from '../validate-config/ValidateConfigCliCommand';
import { createLogger } from '../../util/CreateLogger';
import { Container } from 'typedi';
import { ValidConfig } from '../validate-config/configs/ValidConfig';
import { CliParams } from '../CliParams';
import { BackupCliCommand } from '../backup/BackupCliCommand';
import { getCurrentProcess } from './utils/getCurrentProcess';
import { Pm2Promisified } from './utils/Pm2Promisified';
import { getCurrentProcesses } from './utils/getCurrentProcesses';
import { buildCronProcessName } from './utils/buildCronProcessName';
import * as fs from 'fs';

type CronCliParams = CliParams & {
  id: string;
  list?: boolean;
  daemon?: boolean;
  stop?: boolean;
};

const logger = createLogger('CronCli');

export class CronCliCommand extends BackupCliCommand {
  createCommand(): Command {
    const command = this.program.command('cron');

    command.action(async (params) => {
      Container.set<CronCliParams>('params', params);

      const validator = new ValidateConfigCliCommand(this.program);

      const config = await validator.validate(params, { cron: true });

      await this.execute(config);
    });

    command.addOption(
      new Option('-i, --id <identifier>', 'Process identifier')
    );

    command.addOption(new Option('-l, --list', 'List current cron processes'));
    command.addOption(new Option('--stop', 'Stop cron process'));
    command.addOption(new Option('-d, --daemon', 'Starts cron as daemon'));

    return command;
  }

  async execute(config: ValidConfig): Promise<void> {
    this.registerContainer(config);

    const params = Container.get<CronCliParams>('params');

    try {
      const pm2p = Pm2Promisified();

      await pm2p.connect();

      if (params.list) {
        await this.listProcesses();
      } else if (params.stop) {
        this.assertParamIdentifier(params);
        await this.stopProcess(params);
      } else if (params.daemon) {
        this.assertParamIdentifier(params);

        this.startCron(config);
      } else if (params.id) {
        this.assertParamIdentifier(params);

        await this.runProcess(params);
      } else {
        logger.errorImportant('No valid parameters');
        this.command.helpInformation();
      }
    } finally {
      pm2.disconnect();
    }
  }

  private async stopProcess(params: CronCliParams) {
    const processName = buildCronProcessName(params.id);

    try {
      const pm2p = Pm2Promisified();

      await pm2p.delete(params.id);

      logger.successImportant(`Stopped process with id: ${params.id}`);
    } catch (e) {
      if (e.message?.includes('process or namespace not found')) {
        logger.warn(`Process with id ${params.id} not found`);
      } else {
        logger.errorImportant('Unknown error');
      }
    }
  }

  private assertParamIdentifier(params: CronCliParams) {
    if (params.id === undefined) {
      logger.errorImportant('--id option required');
      process.exit(1);
    }
  }

  private async runProcess(params: CronCliParams) {
    const pm2p = Pm2Promisified();

    const proc = await getCurrentProcess(params.id);

    if (proc) {
      logger.warn(
        `Already running a backup process with id: ${params.id}. Stopping...`
      );

      await pm2p.delete(params.id);
    }

    const dryParam = params.dry ? '--dry' : '';

    await pm2p.start({
      script: `ts-node src/main.ts cron -d ${dryParam} -i ${params.id} -f ${params.file}`,
      name: buildCronProcessName(params.id)
    });

    logger.successImportant(
      `Cron running in background with id: ${buildCronProcessName(params.id)}`
    );
  }

  private async listProcesses() {
    const processes = await getCurrentProcesses();

    if (processes.length === 0) {
      logger.warn('No processes found');
    } else {
      logger.success('Detected following processes');
      for (const process of processes) {
        const processAny = process as any;

        const createdAt = new Date(processAny.pm2_env.created_at).toISOString();

        logger.success(`------------  ${process.name}  ------------`);
        logger.success(`Process name: ${process.name}`);
        logger.success(`Created at: ${createdAt}`);

        const errorLogPath = processAny.pm2_env.pm_err_log_path;
        const errors = fs.readFileSync(errorLogPath, {
          encoding: 'utf8'
        });

        if (errorLogPath.length > 0) {
          logger.success(`Last 500 characters error logs at ${errorLogPath}:`);
          logger.success(errors.substr(-500));
        }

        const infoLogPath = processAny.pm2_env.pm_out_log_path;
        const info = fs.readFileSync(infoLogPath, {
          encoding: 'utf8'
        });

        if (infoLogPath.length > 0) {
          logger.success(`Last 500 characters logs at ${infoLogPath}:`);
          logger.success(info.substr(-500));
        }
        logger.success('-------------------------------------------');
      }
    }
    process.exit(0);
  }

  private startCron(config: ValidConfig) {
    if (!config.cron) {
      logger.errorImportant('Field "cron" in config file not valid');
      process.exit(1);
    }

    const cronScheduleTime = config.cron;

    logger.successImportant(
      `Cron started at ${new Date().toISOString()} with configuration: ${cronScheduleTime}`
    );

    scheduler.schedule(cronScheduleTime, async () => {
      await this.backup(config);
    });
  }
}
