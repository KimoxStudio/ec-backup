import { getFilename } from './util/getFilename';
import { createOutputFolder } from './util/createOutputFolder';
import { backupBBDD } from './use-cases/backupBBDD';
import { zipBackup } from './use-cases/zipBackup';
import { uploadToGoogleStorage } from './use-cases/uploadToGoogleStorage';
import { env } from './env';
import { config } from './config';
import { sendNotification } from './util/sendNotification';

export const mongodbBackup = async (): Promise<void> => {
  try {
    const database = env.DATABASE_NAME;

    const filename = getFilename(database);

    createOutputFolder();

    backupBBDD(database);

    zipBackup(filename);

    await uploadToGoogleStorage(filename);
  } catch (e) {
    console.error(e);

    if (config.canSendNotification) {
      await sendNotification(`An exception occurred while making backup: ${e}`);
    }
  }
};
