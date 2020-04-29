import mongoose from 'mongoose';
import { logger } from './config/winston';

export default async (
  connectionUrl: string,
  user: string,
  password: string
) => {
  const connect = async () => {
    try {
      await mongoose.connect(connectionUrl, {
        user: user,
        pass: password,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      logger.info(`Successfully connected to ${connectionUrl}`);
    } catch (e) {
      logger.error('Error connecting to database: ', e);
      return process.exit(1);
    }
  };
  await connect();

  mongoose.connection.on('disconnected', connect);
};
