import { config } from '../config';
import { sendTelegramNotification } from '../util/sentTelegramNotification';

export const sendNotification = async (message: string): Promise<void> => {
  if (!config.canSendNotification) {
    console.debug(
      `Notification ${message} could not be sent due unset configuration`
    );
    return;
  }

  if (!config.isDryExecution) {
    try {
      await sendTelegramNotification(message);
    } catch (e) {
      console.warn('Notification send error');
      console.warn(e);
    }
  } else {
    console.debug(`Dry execution: skipping send notification (${message})`);
  }
};
