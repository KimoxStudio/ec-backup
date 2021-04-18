import { spawnSync } from 'child_process';
import { DIR } from '../constants';
import { env } from '../env';

export const backupBBDD = (database: string): void => {
  const backupProcess = spawnSync('mongodump', [
    `-h=${env.DATABASE_HOST}`,
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
