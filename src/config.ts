import { config as dotenvConfig } from 'dotenv';

const env = dotenvConfig({ path: `${__dirname}/../.env` }).parsed;

const get = (key: string, defaultValue?: string): string => {
  if (!env[key] && !defaultValue) {
    console.error(`${key} env variable is required and not found.`);
    process.exit(1);
  }

  return env[key];
};

export const config = {
  GCP_STORAGE_KEY_PATH: get('GCP_STORAGE_KEY_PATH'),
  GCP_PROJECT_ID: get('GCP_PROJECT_ID'),
  GCP_BUCKET_NAME: get('GCP_BUCKET_NAME'),
  GCP_BACKUPS_FOLDER_PATH: get('GCP_BACKUPS_FOLDER_PATH', 'backups'),
  DATABASE_NAME: get('DATABASE_NAME')
};
