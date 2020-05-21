import server from './socket';
import connect from './connect';
import { logger } from './config/winston';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.SERVER_PORT) || 8080;
const connectionUrl = process.env.MONGO_CONNECTION_URL;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

connect(connectionUrl, mongoUser, mongoPassword)
  .then(() => {
    server.listen(port, () => {
      logger.info(`Listening at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });
