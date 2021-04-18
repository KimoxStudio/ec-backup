import * as Storage from '@google-cloud/storage';
import { Bucket } from '@google-cloud/storage';
import { DIR } from '../constants';
import { env } from '../env';
import * as fs from 'fs';
import { config } from '../config';
import { sendNotification } from '../util/sendNotification';

export const uploadToGoogleStorage = async (
  filename: string
): Promise<void> => {
  const filePath = `${DIR}/${filename}.zip`;

  if (!config.isDryExecution) {
    const storage = new Storage.Storage({
      keyFilename: env.GCP_STORAGE_KEY_PATH,
      projectId: env.GCP_PROJECT_ID
    });

    const bucket = new Bucket(storage, env.GCP_BUCKET_NAME);

    const destinationFolder = env.GCP_BACKUPS_FOLDER_PATH || `backups`;
    const destinationPath = `${destinationFolder}/${filename}.zip`;

    const backupSize = fs.statSync(filePath).size;

    await bucket.upload(filePath, {
      destination: destinationPath,
      onUploadProgress: (progressEvent) => {
        const progress = (
          (progressEvent.bytesWritten / backupSize) *
          100
        ).toFixed(2);

        console.log(`Upload: ${progress}%`);
      }
    });
  } else {
    console.debug('Dry execution: skipping backup upload');
  }

  fs.rmSync(filePath, {
    force: true,
    recursive: true
  });

  if (config.canSendNotification) {
    await sendNotification('Backup upload successfully 🚀');
  }
};
