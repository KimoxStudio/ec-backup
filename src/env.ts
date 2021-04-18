import { config as dotenvConfig } from 'dotenv';

const dotenv = dotenvConfig({ path: `${__dirname}/../.env` }).parsed;

const get = (key: string, defaultValue?: string): string => {
  if (!dotenv[key] && !defaultValue) {
    console.error(`${key} env variable is required and not found.`);
    process.exit(1);
  }

  return dotenv[key];
};

export const env = {
  GCP_STORAGE_KEY_PATH: get('GCP_STORAGE_KEY_PATH'),
  GCP_PROJECT_ID: get('GCP_PROJECT_ID'),
  GCP_BUCKET_NAME: get('GCP_BUCKET_NAME'),
  GCP_BACKUPS_FOLDER_PATH: get('GCP_BACKUPS_FOLDER_PATH', 'backups'),
  DATABASE_NAME: get('DATABASE_NAME'),
  DATABASE_HOST: get('DATABASE_HOST')
};
