import express, { Request, Response } from 'express';
import bot from './bot/bot';

import { cronDailyStat, cronIsChallengeDone, cronRemindLazies } from './cron-tasks/challenge-cron';
import { connectDb } from './db/db_connect';
import logger from './helpers/logger';
import wakeUpDyno from './helpers/antiIdle';

const NAMESPACE = 'app.ts';

bot.launch()
  .then(() => logger.info(NAMESPACE, 'bot up and running'))
  .catch((error: Error) => logger.error(NAMESPACE, error.message, error));

connectDb().then(() => logger.info(NAMESPACE, 'connect to DB success'));

cronDailyStat.start();

cronIsChallengeDone.start();

cronRemindLazies.start();

// anti idle conspiracy
const URL = 'https://dofa-challenge-bot.herokuapp.com/';
const app = express();

wakeUpDyno(URL);

app.get('/', (request: Request, response: Response) => {
  logger.info(NAMESPACE, `${Date.now()} Ping Received`);
  response.sendStatus(200);
});
app.listen(process.env.PORT, () => {
  wakeUpDyno(URL);
});
