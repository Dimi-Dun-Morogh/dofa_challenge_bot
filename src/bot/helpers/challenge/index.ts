import { createChallengeDb } from '../../../db/challenge_crud';
import logger from '../../../helpers/logger';
import { previewChalObj, participant, IChallenge } from '../../../types';

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
};

export default challenge;
