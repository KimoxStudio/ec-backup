import { config as dotenvConfig } from 'dotenv';

const dotenv = dotenvConfig({ path: `${__dirname}/../.env` }).parsed;

const get = (
  key: string,
  { defaultValue, required } = { defaultValue: undefined, required: true }
): string => {
  if (!dotenv[key] && required) {
    console.error(`${key} env variable is required and not found.`);
    process.exit(1);
  }

  if (!dotenv[key]) return defaultValue;

  return dotenv[key];
};

const getOptional = (key: string, defaultValue?) =>
  get(key, { defaultValue, required: false });

export const env = {
  GCP_STORAGE_KEY_PATH: get('GCP_STORAGE_KEY_PATH'),
  GCP_PROJECT_ID: get('GCP_PROJECT_ID'),
  GCP_BUCKET_NAME: get('GCP_BUCKET_NAME'),
  GCP_BACKUPS_FOLDER_PATH: getOptional('GCP_BACKUPS_FOLDER_PATH', 'backups'),
  DATABASE_NAME: get('DATABASE_NAME'),
  DATABASE_HOST: get('DATABASE_HOST'),
  TELEGRAM_BOT_TOKEN: getOptional('TELEGRAM_BOT_TOKEN'),
  TELEGRAM_CHAT_ID: getOptional('TELEGRAM_CHAT_ID')
};
