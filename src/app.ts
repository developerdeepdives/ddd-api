import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { LoggerStream } from './config/winston';
import localStrategy from './auth/auth';
import jwtStrategy from './auth/verifyToken';
import User from './models/user';
import articleRouter from './routes/article';
import userRouter from './routes/user';
import challengeRouter from './routes/challenge';
import roomRouter from './routes/room';
import languageRouter from './routes/language';

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
    allowedHeaders: ['x-auth-token', 'Authorization', 'Content-Type'],
  })
);

app.use(express.json({ limit: '2mb' }));

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);

app.get('/', async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    await User.findOneAndUpdate(
      { email: 'tylers@test.com' },
      {
        $set: {
          emailVerified: true,
        },
      }
    );
  }
  return res.send({
    success: true,
  });
});

app.use('/article', articleRouter);
app.use('/user', userRouter);
app.use('/challenge', challengeRouter);
app.use('/room', roomRouter);
app.use('/language', languageRouter);

export default app;
