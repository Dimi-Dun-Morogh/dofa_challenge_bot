import {IChallenge} from './types';


class Api {
  private url:string = 'https://dofa-challenge-bot.herokuapp.com/api/';

  async getAllChallenges():Promise<IChallenge[]> {
    try {
      const data = await fetch(this.url+'challenges/all').then(data=>data.json());
      return data;
    } catch (error) {
      console.error(error)
    }
  }

  async getChallengeById(id:string) {
    try {
      const data = await fetch (this.url+`challenges/${id}`).then(data=>data.json());
      return data
    } catch (error) {
      console.error(error);
    }
  }

};


export default new Api();