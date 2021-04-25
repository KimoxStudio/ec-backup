import { mongodbBackup } from './mongodbBackup';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const main = async () => {
  try {
    await mongodbBackup();
  } catch (e) {
    console.error(e);
    console.log(
      'An exception occurred while making backup. Make sure that your BBDD in Mongo exists.'
    );
  }
};

main().then(() => process.exit(0));
