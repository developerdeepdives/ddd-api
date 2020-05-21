import Language from '../models/language';
import { Request, Response } from 'express';

export const getLanguages = async (req: Request, res: Response) => {
  const languages = await Language.find();
  res.send(languages);
};
