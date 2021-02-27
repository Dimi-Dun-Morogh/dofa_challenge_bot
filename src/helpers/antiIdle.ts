import logger from './logger';

const fetch = require('node-fetch');

const NAMESPACE = 'antiIdle.js';

const wakeUpDyno = (url: string, interval = 25, callback?: Function) => {
  const milliseconds = interval * 60000;
  setTimeout(() => {
    try {
      logger.info(NAMESPACE, 'wakeUpDyno settimeout called');
      // HTTP GET request to the dyno's url
      fetch(url).then(() => logger.info(NAMESPACE, `Fetching ${url}.`));
    } catch (err) {
      // catch fetch errors
      logger.error(NAMESPACE, `Error fetching ${url}: ${err.message}
          Will try again in ${interval} minutes...`);
    } finally {
      try {
        if (!callback) return null;
        callback(); // execute callback, if passed
      } catch (e) {
        // catch callback error
        logger.info(NAMESPACE, 'Callback failed: ', e.message);
      } finally {
        // do it all again
        // eslint-disable-next-line no-unsafe-finally
        return wakeUpDyno(url, interval, callback);
      }
    }
  }, milliseconds);
};
export default wakeUpDyno;
