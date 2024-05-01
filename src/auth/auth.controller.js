import AuthService from "./auth.service";
import getUserResource from "./resource/get-user.resource";
const expiresInSeconds = 31536000;
class AuthController {
  /**
   * @description register user
   * @param {*} req
   * @param {*} res
   */
  static async register(req, res) {
    const data = await AuthService.register(req.body, req.files);

    return res.send({
      data: {
        ...new getUserResource(data),
        auth: {
          tokenType: "Bearer",
          token: data.token,
          expiresAt: expiresInSeconds,
        },
      },
    });
  }

  static async login(req, res) {
    const data = await AuthService.login(req.body);

    if (data.message) {
      return res.status(data.status).send({ message: data.message });
    } else {
      return res.send({
        data: {
          ...new getUserResource(data),
          auth: {
            tokenType: "Bearer",
            token: data.token,
            expiresAt: expiresInSeconds,
          },
        },
      });
    }
  }

  static async logOut(req, res) {
    const data = await AuthService.logOut(req.user);
    return res.send({ data });
  }
}

export default AuthController;
