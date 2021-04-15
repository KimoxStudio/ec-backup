import { mongodbBackup } from './mongodb-backup';

const database = process.argv[2];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const main = async () => {
  await mongodbBackup(database);
};

if (!database) {
  console.error('First argument must be the database to backup');
} else {
  main().then(() => process.exit(0));
}
