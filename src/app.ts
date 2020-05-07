import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { LoggerStream } from './config/winston';
import articleRouter from './routes/article';
import userRouter from './routes/user';
import LocalStrategy from './auth/auth';

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

passport.use(LocalStrategy);

app.get('/', (req, res) => {
  return res.send({
    success: true,
  });
});

app.use('/article', articleRouter);
app.use('/user', userRouter);

export default app;
