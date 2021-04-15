import { createOutputFolder } from './util/createOutputFolder';
import { backupBBDD } from './util/backupBBDD';
import { getFilename } from './util/getFilename';
import { zipBackup } from './util/zipBackup';

const database = process.argv[2];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const main = () => {
  const filename = getFilename(database);

  createOutputFolder();

  backupBBDD(database);

  zipBackup(filename);
};

if (!database) {
  console.error('First argument must be the database to backup');
} else {
  main();
}
