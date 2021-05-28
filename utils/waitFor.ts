/* istanbul ignore file */

/**
 * A Testing helper function to wait for stacked promises to resolve
 *
 * @function waitFor
 * @param callback - a callback function to invoke after resolving promises
 * @returns promise
 */
const waitFor = (callback: () => void, timeout = 1000): Promise<any> =>
  new Promise((resolve, reject) => {
    const startTime = Date.now();

    const tick = () => {
      setTimeout(() => {
        try {
          callback();
          resolve("");
        } catch (err) {
          if (Date.now() - startTime > timeout) {
            reject(err);
          } else {
            tick();
          }
        }
      }, 50);
    };

    tick();
  });

export default waitFor;
