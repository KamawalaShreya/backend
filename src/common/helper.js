import bcrypt from "bcryptjs";
import moment from "moment";
import AccessToken from "../../model/access-token";
const Hours = 8760;

export const bcryptPassword = async (password) => {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
};

export const matchHashedPassword = async (password, userPassword) => {
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassword, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });

  return hashedPassword;
};

export const randomStringGenerator = (givenLength = 50) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < givenLength) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const storeAccessToken = async (user, cryptoString) => {
  let expiresAt = moment(new Date())
    .utc()
    .add(Hours, "hours")
    .format("YYYY-MM-DD hh:mm:ss");

  await AccessToken.create({
    token: cryptoString,
    userId: user._id,
    expiresAt: expiresAt,
  });
};
