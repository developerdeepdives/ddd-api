import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { LoggerStream } from './config/winston';

const app = express();

app.use(helmet());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: new LoggerStream(),
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json({ limit: '2mb' }));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.send({
    success: true,
  });
});

export default app;
