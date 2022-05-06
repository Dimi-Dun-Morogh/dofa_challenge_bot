import {
  dailyStatObj, IChallenge, IFinalObj, previewChalObj,
} from '../../../types';

import emojis, { textToEmoji } from './emojis';

class RenderMsgs {
  emojis = emojis;

  previewChal(prevChalObj: previewChalObj): string {
    const { conditions, nameOfChallenge, durationOfChallenge } = prevChalObj;
    const { saintsRow, pin } = emojis;
    return `${saintsRow}Челлендж создан${saintsRow}.\nДанные:\nНазвание челленджа: ${nameOfChallenge}\nусловия челленджа:\n${conditions}\n\nдлительность челленджа:\n${durationOfChallenge} дней\n ${pin}управлять состоянием челленджа${pin} - /challenge_state`;
  }

  controlChal(chalObj: IChallenge): string {
    const {
      conditions,
      nameOfChallenge,
      durationOfChallenge,
      dateOfEnd,
      dateOfStart,
      hasStarted,
      participants,
      _id,
    } = chalObj;
    let participantsStr = '';
    if (participants?.length) {
      participants.forEach(({ username, user_conditions }) => {
        const conditionsMsg = user_conditions ? ` - ${user_conditions}` : '';
        participantsStr += `${this.emojis.green_snowflake}${username}${conditionsMsg}${this.emojis.lightning}, `;
      });
    }
    return `Текущий челлендж:
    название: ${nameOfChallenge}
    условия: ${conditions}
    длительность: ${durationOfChallenge} дней
    дата начала: ${new Date(dateOfStart).toLocaleString('en-GB', { hour12: false })}
    дата конца: ${new Date(dateOfEnd).toLocaleString('en-GB', { hour12: false })}
    Челлендж начался?: ${hasStarted ? 'да' : 'нет'}
    Участники: [${participantsStr}]

    Линк на страничку с данными челленджа https://dofa-challenge-bot.herokuapp.com/static#/id${_id}
    Линк на JSON с данными челленджа https://dofa-challenge-bot.herokuapp.com/api/challenges/${_id}
    `;
  }

  dailyMsg(stats: dailyStatObj) {
    const statStr = Object.entries(stats).reduce(
      (acc, [key, value]) => (acc += `${key} : ${value ? emojis.green_ok : emojis.red_cross}\n`),
      '',
    );
    return `Отчет по челленджу за сегодня ${new Date().toLocaleString('en-GB', { hour12: false })}
${statStr}
    `;
  }

  layziesDailyMsg(stats: dailyStatObj) {
    const statStr = Object.entries(stats).reduce(
      (acc, [key, value]) => (acc += `${key} : ${value ? emojis.green_ok : emojis.red_cross}\n`),
      '',
    );
    return `Сегодня ещё не отметились:
${statStr}
после 22:00 отчеты не принимаются!
    `;
  }

  finalMsg(chalObj: IChallenge, stats: IFinalObj, isNotEnd?: boolean | undefined) {
    const statsRendered = Object.entries(stats).reduce((acc, [name, stat]) => {
      let res = acc;
      const statStr = stat.reduce(
        (accM, dayRes) => (accM += `${dayRes ? emojis.green_ok : emojis.red_cross}`),
        '',
      );
      // зарендерить условия персональные
      const participant = chalObj.participants.find((user) => user.username === name);
      const condsMsg = participant?.user_conditions ? ` - ${participant?.user_conditions}` : '';

      res += `${name}${condsMsg} : [${statStr}]\n`;
      return res;
    }, '');
    const { dateOfEnd, durationOfChallenge } = chalObj;

    const daysTillEnd = Math.round((dateOfEnd - Number(new Date())) / (60 * 60 * 24 * 1000));
    const todaysDay = +durationOfChallenge - daysTillEnd;

    return `Челлендж ${chalObj.nameOfChallenge} \n\n ${this.emojis.pin} Дней до конца ${textToEmoji(
      daysTillEnd,
    )}\n ${this.emojis.pin} Сегодня день ${textToEmoji(todaysDay)}\n\n${this.emojis.pin} ${
      isNotEnd ? 'предварительные резы' : 'окончен'
    }
${statsRendered}

Линк на страничку с данными челленджа https://dofa-challenge-bot.herokuapp.com/static#/id${
  chalObj._id
}
Линк на JSON с данными челленджа https://dofa-challenge-bot.herokuapp.com/api/challenges/${
  chalObj._id
}
`;
  }

  messageSplitter(messageString: string) {
    const max_size = 4096;

    const amount_sliced = messageString.length / max_size;
    let start = 0;
    let end = max_size;
    let message;
    const messages: Array<string> = [];
    for (let i = 0; i < amount_sliced; i += 1) {
      message = messageString.slice(start, end);
      messages.push(message);
      start += max_size;
      end += max_size;
    }
    return messages;
  }
}

export default new RenderMsgs();
