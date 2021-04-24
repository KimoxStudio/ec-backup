import { spawnSync } from 'child_process';

export const backupBBDD = ({
  database,
  directory,
  hostname
}: {
  database: string;
  directory: string;
  hostname: string;
}): void => {
  const backupProcess = spawnSync('mongodump', [
    `-h=${hostname}`,
    `--db=${database}`,
    `--out=${directory}/dump`,
    '--forceTableScan'
  ]);

  if (backupProcess.status === 1) {
    console.error(`Backup process failed...`);

    throw new Error(String(backupProcess.output));
  } else {
    console.log('Backup process success');
  }
};
