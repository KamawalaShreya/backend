import passport from "passport";
import AccessToken from "../../../model/access-token";

export default (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const exist = await AccessToken.findOne({
      token: user.jti,
      isRevoked: false,
      userId: user._id,
    });

    if (!exist) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    req.user = user;

    return next();
  })(req, res, next);
};
