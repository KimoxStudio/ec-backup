import { getFilename } from './util/getFilename';
import { createOutputFolder } from './util/createOutputFolder';
import { backupBBDD } from './util/backupBBDD';
import { zipBackup } from './util/zipBackup';
import { uploadToGoogleStorage } from './util/uploadToGoogleStorage';

export const mongodbBackup = async (database: string): Promise<void> => {
  const filename = getFilename(database);

  createOutputFolder();

  backupBBDD(database);

  zipBackup(filename);

  await uploadToGoogleStorage(filename);
};
