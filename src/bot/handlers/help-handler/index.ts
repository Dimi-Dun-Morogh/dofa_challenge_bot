import { Context } from 'telegraf';

const helpHandler = async (ctx: Context) => ctx.reply(`
/challenge_create - создать заготовку под челлендж
/challenge_state - управлять челленджем
/join -  присоединиться к челленджу
/my_stats - мои статы по челленджу на текущее время
/all_stats - статы для всех по челленджу на текущее время
/leave - ливнуть
/conditions - установить персональные условия (пример /conditions 40 отжиманий)

отправить отчёт можно через #отчёт  #отчет

сайт https://dofa-challenge-bot.herokuapp.com/static
`);

export { helpHandler };
