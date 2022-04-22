import { Document } from 'mongoose';

interface previewChalObj {
  nameOfChallenge: string;
  conditions: string;
  durationOfChallenge: string | number;
  chat_id: number;
}

type ID = string | number;

interface participant {
  id: number;
  username: string;
  user_conditions?: string;
}

type dailyStatObj = {
  [key: string]: boolean;
};

interface Ireport {
  date: number;
  username: string | undefined;
  message_id: number;
  user_id: number;
  reported: boolean;
}

interface INewChallenge extends previewChalObj {
  dateOfStart: number;
  dateOfEnd: number;
  isCompleted: boolean;
  hasStarted: boolean;
  chat_id: number;
  reports?: Array<Ireport>;
  participants: Array<participant>;
}

interface IChallenge extends INewChallenge, Document {}

interface IendObj {
  [key: string]: undefined | { [key: string]: boolean | undefined };
}

interface IFinalObj {
  [key: string]: Array<boolean | undefined>;
}

export {
  previewChalObj,
  ID,
  IChallenge,
  INewChallenge,
  participant,
  Ireport,
  dailyStatObj,
  IendObj,
  IFinalObj,
};
