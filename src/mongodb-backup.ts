import { getFilename } from './util/getFilename';
import { createOutputFolder } from './util/createOutputFolder';
import { backupBBDD } from './use-cases/backupBBDD';
import { zipBackup } from './use-cases/zipBackup';
import { uploadToGoogleStorage } from './use-cases/uploadToGoogleStorage';
import { env } from './env';
import { config } from './config';
import { sendNotification } from './util/sendNotification';
import { DIR } from './constants';

export const mongodbBackup = async (): Promise<void> => {
  try {
    const database = env.DATABASE_NAME;

    const filename = getFilename(database);

    createOutputFolder(DIR);

    backupBBDD({ database, directory: DIR, hostname: env.DATABASE_HOST });

    zipBackup({ filename, directory: DIR });

    await uploadToGoogleStorage({
      filename,
      directory: DIR,
      gcpConfig: {
        storageKey: env.GCP_STORAGE_KEY_PATH,
        projectId: env.GCP_PROJECT_ID,
        bucketName: env.GCP_BUCKET_NAME,
        backupsFolderPath: env.GCP_BACKUPS_FOLDER_PATH
      }
    });
  } catch (e) {
    console.error(e);

    if (config.canSendNotification) {
      await sendNotification(`An exception occurred while making backup: ${e}`);
    }
  }
};
