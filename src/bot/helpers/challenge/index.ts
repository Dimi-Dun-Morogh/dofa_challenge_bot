import { createChallengeDb } from '../../../db/challenge_crud';
import logger from '../../../helpers/logger';
import {
  previewChalObj,
  dailyStatObj,
  participant,
  IChallenge,
  Ireport,
  IendObj,
  IFinalObj,
} from '../../../types';
import renderMsgs from '../render-msgs';

const NAMESPACE = 'bot/helpers/challenge';

class Challenge {
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
  }

  async joinChallenge(user: participant, challengeDoc: IChallenge) {
    challengeDoc.participants?.push(user);
    await challengeDoc.save();
  }

  async leaveChallenge(userId: number, challengeDoc: IChallenge) {
    const filtered = challengeDoc.participants?.filter(({ id }) => id !== userId);
    // eslint-disable-next-line no-param-reassign
    challengeDoc.participants = filtered;
    await challengeDoc.save();
  }

  async kickByUserName(kickUser: string, challengeDoc: IChallenge) {
    const isCorrect = challengeDoc.participants?.some(({ username }) => username === kickUser);
    if (!isCorrect) return false;
    const filtered = challengeDoc.participants?.filter(({ username }) => username !== kickUser);
    // eslint-disable-next-line no-param-reassign
    challengeDoc.participants = filtered;
    await challengeDoc.save();
    return true;
  }

  isInChallenge(userId: number, challengeDoc: IChallenge) {
    const isIn = challengeDoc.participants?.some(({ id }) => id === userId);
    return isIn;
  }

  async startChallenge(challengeDoc: IChallenge) {
    try {
      const { durationOfChallenge } = challengeDoc;
      const today = new Date();
      const endChallenge = new Date();

      endChallenge.setHours(23);
      endChallenge.setMinutes(0);
      endChallenge.setDate(today.getDate() + +durationOfChallenge - 1);

      await challengeDoc.update({
        dateOfStart: Number(today),
        dateOfEnd: Number(endChallenge),
        hasStarted: true,
      });
      logger.info(NAMESPACE, 'start challenge succes', challengeDoc);
    } catch (error) {
      logger.error(NAMESPACE, error, error);
    }
  }

  getUserConditions(challengeDoc: IChallenge, userId: number) {
    const userConditions = challengeDoc.participants.find((user) => user.id === userId);
    return userConditions?.user_conditions;
  }

  getUserConditionsByName(challengeDoc: IChallenge, userName: string) {
    const userConditions = challengeDoc.participants.find((user) => user.username === userName);
    return userConditions?.user_conditions;
  }

  async addReport(challengeDoc: IChallenge, report: Ireport) {
    try {
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      const todayEnd = new Date();
      todayEnd.setHours(23);
      todayEnd.setMinutes(0);
      if (report.date > Number(todayEnd)) return 'опоздал  глэк, отчеты до 23:00';
      const isThereReport = challengeDoc.reports?.some(
        ({ date, user_id }) => date > Number(today) && user_id === report.user_id,
      );

      if (!isThereReport) {
        challengeDoc.reports?.push(report);
        await challengeDoc.save();
      }
      const userConditions = this.getUserConditions(challengeDoc, report.user_id);

      let msg = `отчет принят ${renderMsgs.emojis.green_ok}`;
      msg += userConditions ? `\nВаши условия были:\n ${userConditions}` : '';

      return isThereReport
        ? `слыш сегодня от тебя уже был отчет ${renderMsgs.emojis.red_cross}`
        : msg;
    } catch (error) {
      logger.error(NAMESPACE, error, error);
    }
  }

  dailyStat(challengeDoc: IChallenge) {
    const stat: dailyStatObj = challengeDoc.participants.reduce((acc, participantObj) => {
      const today = new Date();
      today.setHours(0);
      today.setMinutes(0);

      const status = challengeDoc.reports
        ?.filter((report) => report.date > Number(today))
        .find(({ user_id }) => user_id === participantObj.id);

      const res = { ...acc };
      res[participantObj.username] = status?.reported;

      return res;
    }, {} as any);
    return stat;
  }

  dailyLazies(challengeDoc: IChallenge) {
    const dailyStats = this.dailyStat(challengeDoc);
    const lazies = Object.entries(dailyStats).filter(([, status]) => status !== true);
    return Object.fromEntries(lazies);
  }

  async reportLazies(challengeObj: IChallenge) {
    // ? this will make a report with false flag for those who did not report true that day
    //! report them false here
    const dalazies = Object.entries(this.dailyLazies(challengeObj));

    for (let i = 0; i < dalazies.length; i += 1) {
      //! достать user id from challenge.participants;
      const username = dalazies[i][0];

      const userId = challengeObj.participants.find(
        ({ username: usernameRep }) => usernameRep === username,
      );

      const report = {
        date: Number(new Date()),
        username,
        message_id: 0,
        user_id: userId!.id, //! достать user id from challenge.participants;
        reported: false,
      };

      await this.addReport(challengeObj, report);
    }
  }

  endStats(challengeDoc: IChallenge) {
    const { reports, participants } = challengeDoc;
    const endObj: IendObj = reports?.reduce((acc, repObj) => {
      const { date } = repObj;
      const res = acc;
      const key = new Date(date);
      key.setHours(0);
      key.setMinutes(0);
      key.setSeconds(0);
      res[key.toLocaleString('en-GB', { hour12: false })] = undefined;
      return res;
    }, {} as any);

    const names = participants.reduce((acc, user) => {
      const res = acc;
      res[user.username] = undefined;
      return res;
    }, {} as { [key: string]: undefined });

    Object.keys(endObj).forEach((key) => {
      endObj[key] = { ...names };
    });

    reports?.forEach((report) => {
      const { username, date } = report;

      const key = new Date(date);
      key.setHours(0);
      key.setMinutes(0);
      key.setSeconds(0);
      endObj[key.toLocaleString('en-GB', { hour12: false })]![`${username!}`] = report.reported;
    });

    const final = Object.keys(names).reduce((acc, name) => {
      const res = acc;

      res[name] = [];
      Object.entries(endObj).forEach(([, resObj]) => {
        res[name].push(resObj![name]);
      });
      return res;
    }, {} as IFinalObj);

    return final;
  }

  endChallenge(challengeDoc: IChallenge, isNotEnd?: boolean | undefined) {
    const { dateOfEnd } = challengeDoc;
    const today = Number(new Date());
    if (dateOfEnd > today && !isNotEnd) return false;
    const stats = this.endStats(challengeDoc);
    const message = renderMsgs.finalMsg(challengeDoc, stats, isNotEnd);
    return message;
  }

  userStats(challengeDoc: IChallenge, userName: string) {
    const stats = this.endStats(challengeDoc);

    const message = renderMsgs.finalMsg(challengeDoc, { [userName]: stats[userName] }, true);
    const userConditions = this.getUserConditionsByName(challengeDoc, userName);
    const finalMsg = userConditions ? `Ваши условия:\n${userConditions}\n${message}` : message;
    return finalMsg;
  }

  async setUserConditions(challengeDoc: IChallenge, userId: number, userConditions: string) {
    const { participants } = challengeDoc;

    const newParticipants = participants.map((participantObj) => {
      if (participantObj.id === userId) {
        participantObj.user_conditions = userConditions;
      }
      return participantObj;
    });
    challengeDoc.participants = newParticipants;
    await challengeDoc.save();
  }
}

export default new Challenge();
