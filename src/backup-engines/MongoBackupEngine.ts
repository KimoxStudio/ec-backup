import { BackupEngine } from './BackupEngine';
import { spawnSync } from 'child_process';
import { compress } from '../util/compress';
import { getDateBasedFilename } from '../util/getDateBasedFilename';
import { MongoBackupEngineConfig } from '../commands/validate-config/configs/engines/MongoBackupEngineConfig';
import { createLogger } from '../util/CreateLogger';

const logger = createLogger('MongoBackupEngine');

export class MongoBackupEngine extends BackupEngine<MongoBackupEngineConfig> {
  buildBackup(outputDir: string): string {
    const dumpOutputFilePath = `${outputDir}/dump`;
    const uri = this.buildUri();

    const args = [
      `--uri=${uri}`,
      `--out=${dumpOutputFilePath}`,
      '--forceTableScan'
    ];

    const backupProcess = spawnSync('mongodump', args);

    if (backupProcess.status === 1) {
      logger.errorImportant(`Backup process failed due unknown error`);

      throw new Error(String(backupProcess.output));
    } else {
      logger.success('Backup process success');
    }

    const compressOutputFilePath = getDateBasedFilename(
      `${outputDir}/${this.config.databaseName}`
    );

    return compress({
      inputAbsoluteFilePath: dumpOutputFilePath,
      outputAbsoluteFilePath: compressOutputFilePath
    });
  }

  private buildUri = () => {
    const database = this.config.databaseName;
    const hostname = this.config.databaseHost;
    const port = this.config.databasePort;

    const username = this.config.username;
    const password = this.config.password;

    if (username && password) {
      return `mongodb+srv://${username}:${password}@${hostname}/${database}?retryWrites=true&w=majority`;
    }

    return `mongodb://${hostname}:${port}/${database}`;
  };
}
