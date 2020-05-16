import { logger } from '../config/winston';
import socketIo from 'socket.io';

interface Socket extends socketIo.Socket {
  request: {
    user: {
      _id: string;
      email: string;
      name: string;
    };
    iat: number;
    exp: number;
  };
}

type OnConnection = (socket: Socket) => void;

const onConnection: OnConnection = (socket) => {
  logger.info(socket.request.user);
  socket.on('disconnect', () => {
    logger.info('User disconnected');
  });
  socket.on('error', (err) => {
    logger.error(err);
  });
};

export default onConnection;
