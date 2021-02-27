import bot from './bot/bot';

import { cronDailyStat, cronIsChallengeDone } from './cron-tasks/challenge-cron';

import { connectDb } from './db/db_connect';
import logger from './helpers/logger';

const NAMESPACE = 'app.ts';

bot.launch()
  .then(() => logger.info(NAMESPACE, 'bot up and running'))
  .catch((error: Error) => logger.error(NAMESPACE, error.message, error));

connectDb().then(() => logger.info(NAMESPACE, 'connect to DB success'));

cronDailyStat.start();

cronIsChallengeDone.start();
