import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { LoggerStream, logger } from './config/winston';
import articleRouter from './routes/article';
import userRouter from './routes/user';
import localStrategy from './auth/auth';
import jwtStrategy, { authenticateUser } from './auth/verifyToken';
import http from 'http';
import socketIo from 'socket.io';
import socketioJwt from 'socketio-jwt-auth';
import onConnection from './handlers/socket';
import User from './models/user';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: new LoggerStream(),
  })
);

app.use(
  cors({
    allowedHeaders: 'x-auth-token',
  })
);

app.use(express.json({ limit: '2mb' }));

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);

app.get('/', authenticateUser, (req, res) => {
  return res.send({
    success: true,
  });
});

app.use('/article', articleRouter);
app.use('/user', userRouter);

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

io.on('connection', onConnection);

export default server;
