import { env } from '../env';

export const sendTelegramNotification = async (
  message: string
): Promise<void> => {
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
};
