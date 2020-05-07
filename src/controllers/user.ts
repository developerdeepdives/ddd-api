import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/winston';
import User from '../models/user';
import passport from 'passport';
import jwt from 'jsonwebtoken';

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

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  logger.debug('MAde it to loginUser method');
  passport.authenticate('local', (err, user, next) => {
    logger.debug('Inside passport authenticate');
    try {
      if (err || !user) {
        if (err) {
          logger.error(err);
        }
        const error = new Error('An Error has occurred');
        return res.status(401).send(error);
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          logger.error(error);
          return res.status(400).send('A Problem Occurred');
        }
        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.SECRET_STRING);
        res.json({ token });
      });
    } catch (err) {
      logger.error(err);
      res.status(400).send(new Error('A Problem Occurred'));
    }
  })(req, res, next);
};
