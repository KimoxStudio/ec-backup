import * as fs from 'fs';
import { spawnSync } from 'child_process';
import { DIR } from '../constants';

export const zipBackup = (filename: string): void => {
  const zipProcess = spawnSync('zip', ['-r', `${filename}.zip`, `dump`], {
    cwd: `${process.cwd()}/${DIR}`
  });

  const output = String(zipProcess.output);

  if (zipProcess.status === 1 || output.includes('zip warning')) {
    console.error(`Zip backup process failed...`);

    throw new Error(output);
  } else {
    console.log('Zip backup process success');
    fs.rmdirSync(`${DIR}/dump/`, {
      recursive: true
    });
  }
};