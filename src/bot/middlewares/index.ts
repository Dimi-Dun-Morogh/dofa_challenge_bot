// import { TelegrafContext } from 'telegraf/typings/context';
import logger from '../../helpers/logger';

const NAMESPACE = 'BOT-MIDDLEWARE';

const isReport = () => (ctx: any, next:any) => {
  try {
    if (!ctx.message) return null;

    const { text, caption } = ctx.message;

    if (!text && !caption) return null;

    const msg = text || caption;
    const allowed: { [key:string]: boolean } = {
      '#отчет': true,
      '#отчёт': true,
      '/start': true,
      '/info': true,
      exit: true,
    };
    const [command]:[string] = msg.split(' ');

    if (allowed[command]) return next();
  } catch (error) {
    logger.error(NAMESPACE, error.mesage, error);
  }
};

export {
  isReport,
};
