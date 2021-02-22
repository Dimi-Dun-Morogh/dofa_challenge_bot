import bot from './bot/bot';
import {
  createChallengeDb, getCurrentChallenge, updateCurrentChallenge, deleteCurrentChallenge,
} from './db/challenge_crud';
import { connectDb } from './db/db_connect';
import logger from './helpers/logger';

const NAMESPACE = 'app.ts';

bot.launch()
  .then(() => logger.info(NAMESPACE, 'bot up and running'))
  .catch((error: Error) => logger.error(NAMESPACE, error.message, error));

connectDb().then(() => logger.info(NAMESPACE, 'connect to DB success'));

const testObj = {
  nameOfChallenge: 'icebucket',
  conditions: 'get cold',
  durationOfChallenge: '4weeks',
  dateOfStart: 1444,
  dateOfEnd: 144444,
  isCompleted: false,
  chat_id: 1488,
  // reports?: Array<report>
  // participants?: Array<participant>
};

// createChallengeDb(testObj);

getCurrentChallenge(1488);

// updateCurrentChallenge(1488, { dateOfStart: 5555 });

// deleteCurrentChallenge(1488);
