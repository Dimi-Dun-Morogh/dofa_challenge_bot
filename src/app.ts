import express, { Request, Response } from 'express';
import cors from 'cors';
import bot from './bot/bot';

import { runCronTasks } from './cron-tasks/challenge-cron';
import { connectDb } from './db/db_connect';
import logger from './helpers/logger';
import wakeUpDyno from './helpers/antiIdle';
import challengeRouter, { ROUTES } from './REST/router';

const path = require('path');

const NAMESPACE = 'app.ts';
(async () => {
  try {
    bot.launch().then(() => logger.info(NAMESPACE, 'bot up and running'));

    await connectDb().then(() => logger.info(NAMESPACE, 'connect to DB success'));

    // run all scheduled bot tasks
    runCronTasks();
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
})();

// anti idle conspiracy
const URL = 'https://dofa-challenge-bot.herokuapp.com/';
const app = express();
app.use(cors());

app.use('/static', express.static(path.join(__dirname, '../front_end/dist/'))); //!

wakeUpDyno(URL);

app.get('/', (request: Request, response: Response) => {
  logger.info(NAMESPACE, `${Date.now()} Ping Received`);

  response.sendStatus(200);
});

app.use(express.json());
app.use(ROUTES.CHALLENGES, challengeRouter);

app.listen(process.env.PORT || 1337, () => {
  wakeUpDyno(URL);
});
