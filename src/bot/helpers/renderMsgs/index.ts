import { previewChalObj } from '../../../types';
import emojis from './emojis';

const renderMsgs = {
  dictionary: {
    '1week': '7',
    '2weeks': '14',
    '4weeks': '28',
  } as { [key: string]: string },

  previewChal(prevChalObj: previewChalObj) {
    const { conditions, nameOfChallenge, durationOfChallenge } = prevChalObj;
    const { saintsRow, pin } = emojis;
    return `${saintsRow}Челлендж создан${saintsRow}.\nДанные:\nНазвание челленджа: ${nameOfChallenge}\nусловия челленджа:\n${conditions}\n\nдлительность челленджа:\n${this.dictionary[durationOfChallenge]} дней\n ${pin}управлять состоянием челленджа${pin} - /challenge_state`;
  },
};

export default renderMsgs;
