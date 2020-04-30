import { Request, Response } from 'express';
import { logger } from '../config/winston';
import Article from '../models/article';
import User from '../models/user';

export const addArticle = async (req: Request, res: Response) => {
  try {
    const { title, author, body } = req.body;
    const article = new Article({ title, author, body });
    const savedArticle = await article.save();
    await User.findByIdAndUpdate(savedArticle.author, {
      $push: {
        articles: savedArticle._id,
      },
    });
    res.send(savedArticle);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to created article.');
  }
};

export const allArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find();
    res.send(articles);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to retrieve articles.');
  }
};

export const showArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, {
      $inc: {
        views: 1,
      },
    });
    article.populate(
      'author',
      '_id name bio email',
      (err, populatedArticle) => {
        if (err) {
          logger.error(err);
          res.status(400).send('Failed to retrieve article');
        } else {
          res.send(populatedArticle);
        }
      }
    );
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to retrieve article.');
  }
};
