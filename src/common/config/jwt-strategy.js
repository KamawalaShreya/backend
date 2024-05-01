import passport from "passport";
import User from "../../../model/user";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { JWT } from "../constants/constant";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({
        _id: jwtPayload.id,
      });

      if (!user) {
        return done(null, false);
      }

      delete user._doc.password;

      return done(null, { ...user._doc, jti: jwtPayload.jti });
    } catch (error) {
      console.log(error);
      return done(error, false);
    }
  })
);
