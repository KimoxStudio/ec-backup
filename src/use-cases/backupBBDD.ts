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

  if (backupProcess.status === 1) {
    console.error(`Backup process failed...`);

    throw new Error(String(backupProcess.output));
  } else {
    console.log('Backup process success');
  }
};
