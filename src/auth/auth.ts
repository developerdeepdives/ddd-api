import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/user';

export default new LocalStrategy(
  {
    usernameField: 'email',
  },
  async function (email, password, done) {
    try {
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
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
