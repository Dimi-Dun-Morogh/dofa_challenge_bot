import mongoose from 'mongoose';
import { IChallenge } from '../types/index';

const reportSchema = new mongoose.Schema({
  date: Number,
  username: String,
  message_id: Number,
  user_id: Number,
  reported: Boolean,
});

const participantSchema = new mongoose.Schema({
  id: Number,
  username: String,
});

const challengeSchema = new mongoose.Schema({
  nameOfChallenge: {
    type: String,
  },
  conditions: {
    type: String,
  },
  durationOfChallenge: {
    type: String,
  },
  dateOfStart: {
    type: Number,
  },
  dateOfEnd: {
    type: Number,
  },
  isCompleted: {
    type: Boolean,
  },
  hasStarted: {
    type: Boolean,
  },
  chat_id: {
    type: Number,
  },
  reports: [
    reportSchema,
  ],
  participants: [participantSchema],
});

export default mongoose.model<IChallenge>('challenge', challengeSchema);
