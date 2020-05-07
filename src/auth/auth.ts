import { Strategy as LocalStrategy } from 'passport-local';
import { logger } from '../config/winston';
import UserModel from '../models/user';

logger.debug('I never show up in logs');

export default new LocalStrategy(
  {
    usernameField: 'email',
  },
  async function (email, password, done) {
    try {
      logger.debug('authenticating user');
      const user = await UserModel.findOne({ email });
      if (!user) {
        return done(null, false, {
          message: 'User not found',
        });
      }
      const isSamePassword = await user.comparePassword(password);
      if (!isSamePassword) {
        return done(null, false, {
          message: 'Password is wrong',
        });
      }
      logger.debug(user);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
