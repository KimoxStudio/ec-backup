import * as fs from 'fs';
import { spawnSync } from 'child_process';
import { DIR } from '../constants';

export const zipBackup = (filename: string): void => {
  const zipProcess = spawnSync('zip', ['-r', `${filename}.zip`, `dump`], {
    cwd: `${process.cwd()}/${DIR}`
  });

  if (zipProcess.error) {
    console.error(`Zip backup process failed: ${zipProcess.error.message}`);

    throw zipProcess.error;
  } else {
    console.log('Zip backup process success');
    fs.rmdirSync(`${DIR}/dump/`, {
      recursive: true
    });
  }
};
