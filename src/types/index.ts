import { Document } from 'mongoose';

interface previewChalObj {
  nameOfChallenge: string,
  conditions: string,
  durationOfChallenge: string,
}

type ID = string | number;

interface participant {
  id: number
  username: string
}

interface report {
  date: number
  username: string
  message_id: number
  message: number
  challenge_id: number
}

interface INewChallenge extends previewChalObj{
  dateOfStart: number
  dateOfEnd: number
  isCompleted: boolean
  chat_id: number
  reports?: Array<report>
  participants?: Array<participant>
}

interface IChallenge extends INewChallenge, Document {
}

export {
  previewChalObj, ID, IChallenge, INewChallenge,
};
