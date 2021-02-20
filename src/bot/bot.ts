import Telegraf from 'telegraf';
import config from '../config/telegram';

const bot = new Telegraf(config.botApiKey!);

export default bot;
