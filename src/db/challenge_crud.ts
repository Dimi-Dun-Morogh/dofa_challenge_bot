import logger from '../helpers/logger';
import challengeModel from '../models/challenge-model';
import { INewChallenge } from '../types';

const NAMESPACE = 'db/challenge_crud.ts';

const createChallengeDb = async (challengeObj: INewChallenge) => {
  try {
    const res = await challengeModel.create(challengeObj);
    logger.info(NAMESPACE, 'new  challenge created', res);
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
};

const getCurrentChallenge = async (chatId: number) => {
  try {
    const res = await challengeModel.findOne({ chat_id: chatId, isCompleted: false });
    logger.info(NAMESPACE, 'current Challenge', res);
    return res;
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
};

const getChallengeById = async (Id: string) => {
  try {
    const res = await challengeModel.findOne({ _id: Id });
    logger.info(NAMESPACE, 'current Challenge', res);
    return res;
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
};

const updateCurrentChallenge = async (chatId: number, data:any) => {
  try {
    const res = await challengeModel.findOneAndUpdate({
      chat_id: chatId,
      isCompleted: false,
    }, data, { upsert: true });
    return res;
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
};

const deleteCurrentChallenge = async (chatId: number) => {
  try {
    const currentChal = await getCurrentChallenge(chatId);
    if (!currentChal) return;
    await currentChal.delete();
    return true;
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
};

const getAllCurrentChallenges = async () => {
  try {
    const challenges = await challengeModel.find({ isCompleted: false, hasStarted: true });
    return challenges;
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
};

const getAllChallenges = async () => {
  try {
    const challenges = await challengeModel.find();
    return challenges;
  } catch (error) {
    logger.error(NAMESPACE, error, error);
  }
};

export {
  createChallengeDb,
  getCurrentChallenge,
  updateCurrentChallenge,
  deleteCurrentChallenge,
  getAllCurrentChallenges,
  getAllChallenges,
  getChallengeById,
};
