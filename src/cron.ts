import * as scheduler from 'node-cron';
import { mongodbBackup } from './mongodbBackup';
import { env } from './env';
import { config } from './config';

const cron = () => {
  const cronScheduleTime = env.CRON_SCHEDULE_TIME;

  console.log(
    `Cron started at ${new Date().toISOString()}`
  );

  console.log(`Cron scheduled every: ${cronScheduleTime}`)
  console.log(`Database to backup: ${env.DATABASE_NAME}`)

  if (config.canSendNotification) {
    console.log('Telegram notifications enabled')
  }

  if (config.isDryExecution) {
    console.warn('Cron executions will be dried')
  }

  scheduler.schedule(cronScheduleTime, async () => {
    console.log(`Executing cron at ${new Date().toISOString()}`);

    try {
      await mongodbBackup();
    } catch (e) {
      console.error(e);
      console.log(
        'An exception occurred while making backup. Make sure that your BBDD in Mongo exists.'
      );
    }
  });
};

cron();
