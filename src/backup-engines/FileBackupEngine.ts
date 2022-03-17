import { BackupEngine } from './BackupEngine';
import { FileBackupEngineConfig } from '../commands/validate-config/configs/engines/FileBackupEngineConfig';

export class FileBackupEngine extends BackupEngine<FileBackupEngineConfig> {
  buildBackup(): string {
    return '';
  }
}
