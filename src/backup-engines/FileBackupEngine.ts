import { BackupEngine } from './BackupEngine';
import { FileBackupEngineConfig } from '../commands/validate-config/configs/engines/FileBackupEngineConfig';
import { compress } from '../util/compress';

export class FileBackupEngine extends BackupEngine<FileBackupEngineConfig> {
  buildBackup(outputDir: string): string {
    return compress({
      inputAbsoluteFilePath: this.config.path,
      outputAbsoluteFilePath: outputDir
    });
  }
}
