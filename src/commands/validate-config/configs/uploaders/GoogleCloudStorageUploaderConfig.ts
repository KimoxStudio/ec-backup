import * as yup from 'yup';

export type GoogleCloudStorageUploaderConfig = {
  type: 'gcp';
  storageKeyPath: string;
  backupsFolderPath: string;
  bucketName: string;
  projectId: string;
};

export const GoogleCloudStorageUploaderConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('gcp')),
  storageKeyPath: yup.string().required(),
  backupsFolderPath: yup.string().required(),
  bucketName: yup.string().required(),
  projectId: yup.string().required()
});
