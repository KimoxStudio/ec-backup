import * as yup from 'yup';

export type FileBackupEngineConfig = {
  type: 'file';
  path: string;
};

export const FileBackupEngineConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('file')),
  path: yup.string().required()
});
