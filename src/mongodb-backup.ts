import { getFilename } from './util/getFilename';
import { createOutputFolder } from './util/createOutputFolder';
import { backupBBDD } from './use-cases/backupBBDD';
import { zipBackup } from './use-cases/zipBackup';
import { uploadToGoogleStorage } from './use-cases/uploadToGoogleStorage';
import { config } from './config';

export const mongodbBackup = async (): Promise<void> => {
  const database = config.DATABASE_NAME;

  const filename = getFilename(database);

  createOutputFolder();

  backupBBDD(database);

  zipBackup(filename);

  await uploadToGoogleStorage(filename);
};
