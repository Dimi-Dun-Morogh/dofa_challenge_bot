import cron from 'node-cron';
import logger from '../helpers/logger';
import { getAllCurrentChallenges } from '../db/challenge_crud';
import challenge from '../bot/helpers/challenge';
import renderMsgs from '../bot/helpers/render-msgs';
import bot from '../bot/bot';

const NAMESPACE = 'cron-tasks';

const cronDailyStat = cron
  .schedule('0 0 23 * * *', async () => {
    try {
      const allChallenges = await getAllCurrentChallenges();
      logger.info(NAMESPACE, 'all Challenges dailyStat', allChallenges);
      if (!allChallenges) return;

      for (let i = 0; i < allChallenges?.length; i += 1) {
        const challengeObj = allChallenges[i];
        const stat = challenge.dailyStat(challengeObj);
        const message = renderMsgs.dailyMsg(stat);

        // report em to DB false here
        await challenge.reportLazies(challengeObj);

        await bot.telegram.sendMessage(challengeObj.chat_id, message,
          { disable_notification: true });
      }
    } catch (error) {
      logger.error(NAMESPACE, error, error);
    }
  }).stop();

// '0 10 23 * * *'
const cronIsChallengeDone = cron.schedule('0 10 23 * * *', async () => {
  try {
    const allChallenges = await getAllCurrentChallenges();
    allChallenges?.forEach((chal) => {
      const msg = challenge.endChallenge(chal);
      if (msg) {
        renderMsgs.messageSplitter(msg)
          .forEach((text) => bot.telegram.sendMessage(chal.chat_id, text));
        chal.isCompleted = true;
        chal.save();
      }
    });
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
}).stop();

const cronRemindLazies = cron.schedule('0 10 20 * * *', async () => {
  try {
    const allChallenges = await getAllCurrentChallenges();
    allChallenges?.forEach((challengeObj) => {
      const stat = challenge.dailyLazies(challengeObj);
      const msgString = renderMsgs.layziesDailyMsg(stat);
      bot.telegram.sendMessage(challengeObj.chat_id, msgString);
    });
  } catch (error) {
    logger.error(NAMESPACE, 'error in cronRemindLazies()', error);
  }
}).stop();

const runCronTasks = () => {
  cronDailyStat.start();

  cronIsChallengeDone.start();

  cronRemindLazies.start();
};

export {
  runCronTasks,
};
