import { createChallengeDb } from '../../../db/challenge_crud';
import logger from '../../../helpers/logger';
import {
  previewChalObj, dailyStatObj, participant, IChallenge, Ireport, IendObj,
} from '../../../types';
import renderMsgs from '../render-msgs';

const NAMESPACE = 'bot/helpers/challenge';

const challenge = {
  async createChallenge(chalObj: previewChalObj) {
    const newChallenge = {
      ...chalObj,
      dateOfStart: 1488,
      dateOfEnd: 1488,
      isCompleted: false,
      hasStarted: false,
      participants: [],
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
      const isThereReport = challengeDoc.reports?.some(({ date, user_id }) => date > Number(today)
       && user_id === report.user_id);

      if (!isThereReport) {
        challengeDoc.reports?.push(report);
        await challengeDoc.save();
      }
      return isThereReport ? 'слыш сегодня от тебя уже был отчет' : 'отчет принят';
    } catch (error) {
      logger.error(NAMESPACE, error.message, error);
    }
  },

  dailyStat(challengeDoc: IChallenge) {
    const stat: dailyStatObj = challengeDoc.participants.reduce((acc, participantObj) => {
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);

      const status = challengeDoc.reports?.filter((report) => report.date > Number(today))
        .some((report) => report.user_id === participantObj.id);
      const res = { ...acc };
      res[participantObj.username] = status;
      return res;
    }, {} as any);
    return stat;
  },

  endStats(challengeDoc: IChallenge) {
    const { reports, participants } = challengeDoc;
    const endObj = reports?.reduce((acc, repObj) => {
      const { date } = repObj;
      const res = acc;
      const key = new Date(date);
      key.setHours(0);
      key.setMinutes(0);
      key.setSeconds(0);
      res[key.toLocaleString('en-GB', { hour12: false })] = undefined;
      return res;
    }, {} as any);

    Object.keys(endObj).forEach((key) => {
      const names = participants.reduce((acc, user) => {
        const res = acc;
        res[user.username] = undefined;
        return res;
      }, {} as { [key:string]:undefined });
      endObj[key] = names;
    });

    reports?.forEach((report) => {
      const { username, date } = report;
      const key = new Date(date);
      key.setHours(0);
      key.setMinutes(0);
      key.setSeconds(0);
      endObj[key.toLocaleString('en-GB', { hour12: false })][`@${username!}`] = true;
    });

    return endObj as IendObj;
  },

  endChallenge(challengeDoc: IChallenge, isNotEnd?: boolean| undefined) {
    const { dateOfEnd } = challengeDoc;
    const today = Number(new Date());
    if (dateOfEnd > today && !isNotEnd) return false;
    const stats = this.endStats(challengeDoc);
    const message = renderMsgs.finalMsg(challengeDoc, stats, isNotEnd);
    return message;
  },

  userStats(challengeDoc: IChallenge, userName: string) {
    const stats = this.endStats(challengeDoc);
    Object.entries(stats).forEach(([day, userStats]) => {
      const filtered = Object.entries(userStats!).filter(([user]) => user === userName);
      stats[day] = Object.fromEntries(filtered);
    });
    const message = renderMsgs.finalMsg(challengeDoc, stats, true);
    return message;
  },
};

export default challenge;
