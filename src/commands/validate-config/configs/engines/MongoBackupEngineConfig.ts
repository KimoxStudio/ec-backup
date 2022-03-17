import * as yup from 'yup';

export type MongoBackupEngineConfig = {
  type: 'mongo';
  databaseName: string;
  databaseHost: string;
  databasePort: string;
  username?: string;
  password?: string;
};

export const MongoBackupEngineConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('mongo')),
  databaseName: yup.string().required(),
  databaseHost: yup.string().required(),
  databasePort: yup.number().default(27017),
  username: yup.string(),
  password: yup.string()
});
