import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { LoggerStream } from './config/winston';

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

app.get('/', (req, res) => {
  return res.send({
    success: true,
  });
});

export default app;
