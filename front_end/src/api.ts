class Api {
  private url:string = 'https://dofa-challenge-bot.herokuapp.com/api/';

  async getAllChallenges() {
    try {

      const data = await fetch(this.url+'challenges/all').then(data=>console.log(data));

    } catch (error) {
      console.error(error)
    }
  }

};


export default new Api();