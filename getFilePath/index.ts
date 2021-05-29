import { join } from "path";

/**
 * A utility function to join a directory with a filename to a single string.
 *
 * @param {string} file - filename
 * @param {string} dir - directory of the file
 * @returns {string} a single file path string
 */
export default function getFilePath(file: string, dir?: string): string {
  return join(dir || process.cwd(), file);
}
