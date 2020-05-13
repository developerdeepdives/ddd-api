import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export default new JwtStrategy(
  {
    secretOrKey: process.env.SECRET_STRING,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  },
  async (token, done) => {
    try {
      const nowInSeconds = Date.now() / 1000;
      if (token.exp < nowInSeconds) {
        return done(new Error('Token is expired'), false);
      }
      return done(null, token.user);
    } catch (err) {
      done(err, false);
    }
  }
);
