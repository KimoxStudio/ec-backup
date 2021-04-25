import * as fs from 'fs';

export const cleanup = (directory: string): void => {
  fs.rmdirSync(`${directory}/`, {
    recursive: true
  });
};
