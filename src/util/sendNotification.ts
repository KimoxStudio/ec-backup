import * as fetch from 'node-fetch';
import { env } from '../env';
import { config } from '../config';

export const sendNotification = async (message: string): Promise<void> => {
  if (!config.isDryExecution) {
    try {
      const body = {
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        disable_notification: true
      };

      await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'post',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (e) {
      console.warn('Notification send error');
      console.warn(e);
    }
  } else {
    console.debug(`Dry execution: skipping send notification (${message})`);
  }
};
