import * as fs from 'fs';
import { DIR } from '../constants';

export const createOutputFolder = (): void => {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);
};
