import app from './app';
import { logger } from './config/winston';

const port = Number(process.env.SERVER_PORT) || 8080;

app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}/`);
});
