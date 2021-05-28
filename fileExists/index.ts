import { statSync } from "fs";

/**
 * A utility function to check if a file exists.
 *
 * @param {string} file - filename
 * @returns {boolean} whether or not the file exists
 */
export default function fileExists(file: string): boolean {
  try {
    return statSync(file).isFile();
  } catch (e) {
    return false;
  }
}
