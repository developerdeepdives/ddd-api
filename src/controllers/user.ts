import { Request, Response } from 'express';
import { logger } from '../config/winston';
import User from '../models/user';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Token from '../models/Token';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, bio } = req.body;
    if (password !== confirmPassword) {
      throw new Error('Passwords must match.');
    }
    const user = new User({ name, email, password, bio });
    const savedUser = await user.save();
    const token = new Token({
      user: savedUser._id,
      token: crypto.randomBytes(16).toString('hex'),
    });
    await token.save();
    const mailTransport = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SEND_GRID_USER,
        pass: process.env.SEND_GRID_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'no-reply@developerdeepdives.com',
      to: user.email,
      subject: 'Account Verification Token',
      text:
        'Hello,\n\n' +
        'Please verify your account by clicking the link: \nhttp://' +
        req.headers.host +
        '/confirmation/' +
        token.token +
        '.\n',
    };
    await mailTransport.sendMail(mailOptions);
    res
      .status(200)
      .send('A verification email has been sent to ' + user.email + '.');
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to register new user.');
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const tokenData = await Token.findOne({
      token,
    });
    const user = await User.findById(tokenData.user);
    if (!user) {
      return res.status(400).send('Unable to find a user for this token.');
    }
    if (user.emailVerified) {
      return res.status(400).send('This user has already been verified.');
    }
    user.emailVerified = true;
    await user.save();
    res.send('Successfully verified email address. Please log in.');
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to verify email address');
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
