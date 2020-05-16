import { Request, Response } from 'express';
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

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, newPasswordConfirm, oldPassword } = req.body;
    const userId = req.user._id;
    if (newPassword !== newPasswordConfirm) {
      throw new Error('Passwords must match.');
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User does not exist');
    }
    const isValidOldPassword = await user.comparePassword(oldPassword);
    if (isValidOldPassword) {
      user.password = newPassword;
      await user.save();
    }
    throw new Error('Invalid old password.');
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to change password.');
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { name, bio } = req.body;
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
      },
      {
        new: true,
      }
    );
    res.send({
      name: updatedUser.name,
      email: updatedUser.email,
      _id: updatedUser._id,
      bio: updatedUser.bio,
    });
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to edit user.');
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

export const loginUser = (req: Request, res: Response) => {
  passport.authenticate('local', (err, user, info) => {
    try {
      if (err || !user) {
        if (err) {
          logger.error(err);
        }
        if (!user && info) {
          logger.debug(info.message);
        }
        const error = new Error('An Error has occurred');
        return res.status(401).send(error);
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          logger.error(error);
          return res.status(400).send('A Problem Occurred');
        }
        const body = { _id: user._id, email: user.email, name: user.name };
        const token = jwt.sign({ user: body }, process.env.SECRET_STRING, {
          expiresIn: 300,
        });
        res.json({ token });
      });
    } catch (err) {
      logger.error(err);
      res.status(400).send(new Error('A Problem Occurred'));
    }
  })(req, res);
};
