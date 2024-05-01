import jwt from "jsonwebtoken";
import User from "../../model/user";
import {
  bcryptPassword,
  matchHashedPassword,
  randomStringGenerator,
  storeAccessToken,
} from "../common/helper";
import { JWT } from "../common/constants/constant";
import AccessToken from "../../model/access-token";
import {
  ConflictException,
  NotFoundException,
  PreconditionFailedException,
} from "../common/error-exceptions";

class AuthService {
  /**
   * @description Register
   * @param {*} reqData
   */
  static async register(reqData, files) {
    const findUser = await User.findOne({ email: reqData.email });
    if (findUser) {
      throw new ConflictException("User Already exist");
    } else {
      if (files.profileImage) {
        reqData.profileImage =
          files.profileImage[0].destination +
          "/" +
          files.profileImage[0].filename;
      }

      reqData.password = await bcryptPassword(reqData.password);

      const user = await User.create(reqData);

      const randomString = await randomStringGenerator();

      // generate jwt token
      const token = await jwt.sign(
        { id: user._id, jti: randomString },
        JWT.SECRET, //jwt secret
        { expiresIn: "1 YEAR" } // expire time
      );

      // store access token
      await storeAccessToken(user, randomString);

      user.token = token;
      // const token = await
      return user;
    }
  }

  static async login(reqData) {
    const findUser = await User.findOne({ email: reqData.email });

    if (!findUser) {
      throw new NotFoundException("User not found");
    } else {
      const matchPassword = await matchHashedPassword(
        reqData.password,
        findUser.password
      );

      if (!matchPassword) {
        throw new PreconditionFailedException("password mismatched");
      }

      const randomString = await randomStringGenerator();

      const token = await jwt.sign(
        { id: findUser._id, jti: randomString },
        JWT.SECRET,
        { expiresIn: "1 YEAR" }
      );

      await storeAccessToken(findUser, randomString);
      findUser.token = token;

      return findUser;
    }
  }

  static async logOut(authUser) {
    await AccessToken.updateOne({ token: authUser.jti }, { isRevoked: true });

    return "Logout successfully";
  }
}

export default AuthService;
