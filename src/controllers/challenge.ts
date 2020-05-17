import { Request, Response } from 'express';
import { logger } from '../config/winston';
import Challenge from '../models/challenge';
import User from '../models/user';

export const addChallenge = async (req: Request, res: Response) => {
  try {
    const author = req.user._id;
    const { title, description, tests, startCode } = req.body;
    const challenge = new Challenge({
      author,
      title,
      description,
      tests,
      startCode,
    });
    const savedChallenge = await challenge.save();
    await User.findByIdAndUpdate(savedChallenge.author, {
      $push: {
        challenges: savedChallenge._id,
      },
    });
    res.send(savedChallenge);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to created challenge.');
  }
};

export const allChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find();
    res.send(challenges);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to retrieve challenges.');
  }
};

export const showChallenge = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, {
      $inc: {
        views: 1,
      },
    });
    const populatedChallenge = await challenge
      .populate('author', '_id name bio email')
      .populate('tests.language')
      .execPopulate();
    res.send(populatedChallenge);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to retrieve challenge.');
  }
};

export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findById(id);
    if (challenge.author !== req.user._id) {
      return res.sendStatus(401);
    }
    const { title, description, tests, startCode } = req.body;
    challenge.description = description;
    challenge.tests = tests;
    challenge.title = title;
    challenge.startCode = startCode;
    await challenge.save();
    res.send(challenge);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to created challenge.');
  }
};
