import { createChallengeDb } from '../../../db/challenge_crud';
import logger from '../../../helpers/logger';
import {
  previewChalObj, participant, IChallenge, Ireport,
} from '../../../types';

const NAMESPACE = 'bot/helpers/challenge';

const challenge = {
  async createChallenge(chalObj: previewChalObj) {
    const newChallenge = {
      ...chalObj,
      dateOfStart: 1488,
      dateOfEnd: 1488,
      isCompleted: false,
      hasStarted: false,
    };
    await createChallengeDb(newChallenge);
    logger.info(NAMESPACE, 'new challenge created', newChallenge);
  },

  async joinChallenge(user: participant, challengeDoc: IChallenge) {
    challengeDoc.participants?.push(user);
    await challengeDoc.save();
  },

  async leaveChallenge(userId: number, challengeDoc: IChallenge) {
    const filtered = challengeDoc.participants?.filter(({ id }) => id !== userId);
    // eslint-disable-next-line no-param-reassign
    challengeDoc.participants = filtered;
    await challengeDoc.save();
  },

  isInChallenge(userId: number, challengeDoc: IChallenge) {
    const isIn = challengeDoc.participants?.some(({ id }) => id === userId);
    return isIn;
  },

  async startChallenge(challengeDoc: IChallenge) {
    try {
      const {
        durationOfChallenge,
      } = challengeDoc;
      const today = new Date();
      const endChallenge = new Date();

      endChallenge.setHours(23);
      endChallenge.setMinutes(0);
      endChallenge.setDate(today.getDate() + +durationOfChallenge);

      await challengeDoc.update({
        dateOfStart: Number(today),
        dateOfEnd:
    Number(endChallenge),
        hasStarted: true,
      });
      logger.info(NAMESPACE, 'start challenge succes', challengeDoc);
    } catch (error) {
      logger.error(NAMESPACE, error.message, error);
    }
  },
  async addReport(challengeDoc: IChallenge, report: Ireport) {
    try {
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      const todayEnd = new Date();
      todayEnd.setHours(23);
      todayEnd.setMinutes(0);
      if (report.date > Number(todayEnd)) return 'опоздал  глэк, отчеты до 23:00';
      const isThereReport = challengeDoc.reports?.some(({ date, user_id }) => date > Number(today) && user_id === report.user_id);

      if (!isThereReport) {
        challengeDoc.reports?.push(report);
        await challengeDoc.save();
      }
      return isThereReport ? 'слыш сегодня от тебя уже был отчет' : 'отчет принят';
    } catch (error) {
      logger.error(NAMESPACE, error.message, error);
    }
  },
};

export default challenge;
