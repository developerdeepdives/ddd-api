import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { LoggerStream } from './config/winston';
import articleRouter from './routes/article';
import userRouter from './routes/user';
import localStrategy from './auth/auth';
import jwtStrategy from './auth/verifyToken';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: new LoggerStream(),
  })
);

app.use(cors());

app.use(express.json({ limit: '2mb' }));

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);

app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.send({
    success: true,
  });
});

app.use('/article', articleRouter);
app.use('/user', userRouter);

export default app;
