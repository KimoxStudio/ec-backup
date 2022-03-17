import * as fs from 'fs';
import { Container } from 'typedi';
import * as Storage from '@google-cloud/storage';
import { Bucket } from '@google-cloud/storage';

import { GoogleCloudStorageUploaderConfig } from '../commands/validate-config/configs/uploaders/GoogleCloudStorageUploaderConfig';
import { Uploader } from './Uploader';
import { CliParams } from '../commands/CliParams';
import { createLogger } from '../util/CreateLogger';

const logger = createLogger('GoogleCloudStorageUploader');

export class GoogleCloudStorageUploader extends Uploader<GoogleCloudStorageUploaderConfig> {
  async upload(absoluteFilePath: string): Promise<void> {
    const params = Container.get<CliParams>('params');

    if (params.dry) {
      logger.warn('Dry execution: skipping backup upload');

      return;
    }

    const storage = new Storage.Storage({
      keyFilename: this.config.storageKeyPath,
      projectId: this.config.projectId
    });

    const bucket = new Bucket(storage, this.config.bucketName);

    const filename = absoluteFilePath.split('/').pop();

    const destinationFolder = this.config.backupsFolderPath || `backups`;
    const destinationPath = `${destinationFolder}/${filename}.zip`;

    const backupSize = fs.statSync(absoluteFilePath).size;

    await bucket.upload(absoluteFilePath, {
      destination: destinationPath,
      onUploadProgress: (progressEvent) => {
        const progress = (
          (progressEvent.bytesWritten / backupSize) *
          100
        ).toFixed(2);

        logger.success(`Upload progress: ${progress}%`);
      }
    });
  }
}
