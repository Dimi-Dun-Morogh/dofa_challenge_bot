import express, { Request, Response } from 'express';
import { getAllChallenges, getChallengeById } from '../../db/challenge_crud';

const router = express.Router();

router.get('/all', async (req: Request, res: Response) => {
  try {
    const data = await getAllChallenges();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await getChallengeById(id);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;

export enum ROUTES {
  CHALLENGES = '/api/challenges',

}
