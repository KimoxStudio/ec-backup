import * as Storage from '@google-cloud/storage';
import { Bucket } from '@google-cloud/storage';
import { DIR } from '../constants';
import { config } from '../config';
import * as fs from 'fs';

export const uploadToGoogleStorage = async (
  filename: string
): Promise<string> => {
  const storage = new Storage.Storage({
    keyFilename: config.GCP_STORAGE_KEY_PATH,
    projectId: config.GCP_PROJECT_ID
  });

  const bucket = new Bucket(storage, config.GCP_BUCKET_NAME);

  const filePath = `${DIR}/${filename}.zip`;

  const destinationFolder = config.GCP_BACKUPS_FOLDER_PATH || `backups`;
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

  fs.rmSync(filePath, {
    force: true,
    recursive: true
  });

  return bucket.file(destinationPath).publicUrl();
};
