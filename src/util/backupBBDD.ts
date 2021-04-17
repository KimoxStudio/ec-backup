import { spawnSync } from 'child_process';
import { DIR } from '../constants';
import { config } from '../config';

export const backupBBDD = (database: string): void => {
  const backupProcess = spawnSync('mongodump', [
    `-h=${config.DATABASE_HOST}`,
    `--db=${database}`,
    `--out=${DIR}/dump`,
    '--forceTableScan'
  ]);

  if (backupProcess.error) {
    console.error(`Backup process failed: ${backupProcess.error.message}`);

    throw backupProcess.error;
  } else {
    console.log('Backup process success');
  }
};
