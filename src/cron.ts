import * as scheduler from 'node-cron';
import { mongodbBackup } from './mongodb-backup';

const database = process.argv[2];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const cron = () => {
  console.log(`Cron started at ${new Date().toISOString()}`);

  scheduler.schedule('59 23 * * *', async () => {
    console.log(`Executing cron at ${new Date().toISOString()}`);
    await mongodbBackup(database);
  });
};

if (!database) {
  console.error('First argument must be the database to backup');
} else {
  cron();
}
