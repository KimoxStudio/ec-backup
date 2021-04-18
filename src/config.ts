import { env } from './env';

const args = process.argv.map((arg) => arg.toLowerCase());

export const config = {
  canSendNotification: !!env.TELEGRAM_BOT_TOKEN,
  isDryExecution: !!args.includes('--dry')
};
