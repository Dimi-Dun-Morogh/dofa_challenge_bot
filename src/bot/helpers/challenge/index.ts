import { createChallengeDb } from '../../../db/challenge_crud';
import logger from '../../../helpers/logger';
import { previewChalObj } from '../../../types';

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
    const res = await createChallengeDb(newChallenge);
    logger.info(NAMESPACE, 'new challenge created', newChallenge);
  },
};

export default challenge;
