import { Request, Response } from 'express';
import { logger } from '../config/winston';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, bio } = req.body;
    const user = new User({ name, email, password, bio });
    const savedUser = await user.save();
    res.send({
      name: savedUser.name,
      email: savedUser.email,
      _id: savedUser._id,
    });
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to register new user.');
  }
};

export const singleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.send(user);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to retrieve user.');
  }
};
