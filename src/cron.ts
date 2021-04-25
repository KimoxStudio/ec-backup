import * as scheduler from 'node-cron';
import { mongodbBackup } from './mongodbBackup';
import { env } from './env';

const cron = () => {
  const cronScheduleTime = env.CRON_SCHEDULE_TIME;

  console.log(
    `Cron started at ${new Date().toISOString()} (${cronScheduleTime})`
  );

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
