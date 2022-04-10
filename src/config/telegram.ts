let token = '';
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
  // token = process.env.dev_bot_token!;
  token = process.env.tg_bot_token!;
}

const telegramConfig = {
  botApiKey: token || process.env.tg_bot_token,
};

export default telegramConfig;
