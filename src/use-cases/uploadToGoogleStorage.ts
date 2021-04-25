import * as Storage from '@google-cloud/storage';
import { Bucket } from '@google-cloud/storage';
import * as fs from 'fs';

export const uploadToGoogleStorage = async ({
  filename,
  directory,
  gcpConfig: { storageKey, projectId, bucketName, backupsFolderPath }
}: {
  filename: string;
  directory: string;
  gcpConfig: {
    storageKey: string;
    projectId: string;
    bucketName: string;
    backupsFolderPath: string;
  };
}): Promise<void> => {
  const filePath = `${directory}/${filename}.zip`;

  const storage = new Storage.Storage({
    keyFilename: storageKey,
    projectId: projectId
  });

  const bucket = new Bucket(storage, bucketName);

  const destinationFolder = backupsFolderPath || `backups`;
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
};
