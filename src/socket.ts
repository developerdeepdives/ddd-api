import { logger } from './config/winston';
import socketIo from 'socket.io';
import Room from './models/room';
import socketioJwt from 'socketio-jwt-auth';
import User from './models/user';
import app from './app';
import http from 'http';
import Message from './models/message';

const server = http.createServer(app);

const io = socketIo(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
      'Access-Control-Allow-Origin': req.headers.origin, //or the specific origin you want to give access to,
      'Access-Control-Allow-Credentials': true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});

io.origins('*:*');

io.use(
  socketioJwt.authenticate(
    {
      secret: process.env.SECRET_STRING,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.user._id);
        logger.debug(payload);
        if (!user) {
          return done(null, false, 'user does not exist');
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

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

interface Message {
  body: string;
}

const broadcast = function (socket: Socket, event: string, context: any) {
  const rooms = socket.rooms;
  let newSocket: Socket;
  for (const room in rooms) {
    if (newSocket) {
      newSocket = newSocket.to(room);
    } else {
      newSocket = socket.to(room);
    }
  }
  newSocket.emit(context);
};

io.on('connection', (socket) => {
  logger.info(socket.request.user);
  socket.on('join', async (roomId) => {
    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        $push: {
          members: socket.request.user._id,
        },
      },
      {
        new: true,
      }
    );
    if (!room) {
      socket.emit('no_room');
    }
    const populatedRoom = await room
      .populate('members', '_id name')
      .execPopulate();
    socket.join(room._id, (err) => {
      if (err) {
        socket.emit('no_room');
      }
      io.in(roomId).emit('members', populatedRoom.members);
    });
    socket.on('leave_room', async () => {
      socket.leave(roomId);
      const room = await Room.findByIdAndUpdate(
        roomId,
        {
          $pull: {
            members: socket.request.user._id,
          },
        },
        {
          new: true,
        }
      );
      if (!room) {
        socket.emit('no_room');
      }
      const populatedRoom = await room
        .populate('members', '_id name')
        .execPopulate();
      io.in(roomId).emit('members', populatedRoom.members);
    });
    socket.on('chat_message', async ({ body }: Message) => {
      const message = new Message({
        body,
        author: socket.request.user._id,
        room: roomId,
      });
      const savedMessage = await (await message.save())
        .populate('author', '_id name')
        .execPopulate();
      io.in(roomId).emit('newMessage', savedMessage);
    });
    socket.on('code_change', async ({ body }: Message) => {
      const room = await Room.findByIdAndUpdate(
        roomId,
        {
          code: body,
        },
        {
          new: true,
        }
      );
      if (!room) {
        socket.emit('no_room');
      }
      socket.to(roomId).emit('code', room.code);
    });
  });
  socket.on('disconnect', () => {
    logger.info('User disconnected');
  });
  socket.on('error', (err) => {
    logger.error(err);
  });
});

export default server;
