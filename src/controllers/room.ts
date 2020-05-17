import { Request, Response } from 'express';
import { logger } from '../config/winston';
import Room from '../models/room';
import User from '../models/user';

export const addRoom = async (req: Request, res: Response) => {
  try {
    const author = req.user._id;
    const { title, description, tests, startCode } = req.body;
    const room = new Room({
      author,
      title,
      description,
      tests,
      startCode,
    });
    const savedRoom = await room.save();
    await User.findByIdAndUpdate(author, {
      room: savedRoom._id,
    });
    res.send(savedRoom);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to created room.');
  }
};

export const allRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    res.send(rooms);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to retrieve rooms.');
  }
};

export const showRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, {
      $inc: {
        views: 1,
      },
    });
    const populatedRoom = await room
      .populate('author', '_id name bio email')
      .populate('tests.language')
      .execPopulate();
    res.send(populatedRoom);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to retrieve room.');
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (room.owner !== req.user._id) {
      return res.sendStatus(401);
    }
    const { title } = req.body;
    room.title = title;
    await room.save();
    res.send(room);
  } catch (err) {
    logger.error(err);
    res.status(400).send('Failed to created room.');
  }
};
