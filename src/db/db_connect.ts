import mongoose from 'mongoose';

import config from '../config/db';

export const connectDb = () => mongoose.connect(config.url!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
