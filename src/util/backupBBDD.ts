import { spawnSync } from 'child_process';
import { DIR } from '../constants';

export const backupBBDD = (database: string): void => {
  const backupProcess = spawnSync('mongodump', [
    `--db=${database}`,
    `--out=${DIR}/dump`
  ]);

  if (backupProcess.error) {
    console.error(`Backup process failed: ${backupProcess.error.message}`);

    throw backupProcess.error;
  } else {
    console.log('Backup process success');
  }
};
