import * as fs from 'fs';
import { readdirSync, rmSync } from 'fs';
import * as path from 'path';

export const appDir = path.dirname(require.main.filename);

export function writeFile(fileDest: string, buffer: any): Promise<any> {
  //create dir if not exist
  const fileDir = getDirectoryOfFilePath(fileDest);
  createDirectoryIfNotExist(fileDir);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(fileDest);
    file.write(buffer);
    file.end();
    file.on('finish', () => {
      resolve(fileDest);
    });
    file.on('error', reject);
  });
}
export function createDirectoryIfNotExist(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
export function getDirectoryOfFilePath(filePath: string) {
  return filePath.substring(0, filePath.lastIndexOf('/') + 1);
}
export function clearDirectory(dir: string) {
  readdirSync(dir).forEach(file => rmSync(`${dir}/${file}`));
}
