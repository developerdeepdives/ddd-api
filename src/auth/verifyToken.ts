import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

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

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};

type validDictionaries = 'params' | 'body';

type EnsureUserIdentity = (
  dictionary?: validDictionaries,
  key?: string
) => (req: Request, res: Response, next: NextFunction) => void;

export const ensureUserIdentity: EnsureUserIdentity = (
  dictionary = 'params',
  key = 'id'
) => {
  return (req, res, next) => {
    if (!req.user || !req.user._id) {
      res.sendStatus(401);
    }
    if (!req[dictionary] || !req[dictionary][key]) {
      res.sendStatus(400);
    }
    const suppliedUserId = req[dictionary][key];
    if (suppliedUserId === req.user._id) {
      next();
    }
    res.sendStatus(401);
  };
};
