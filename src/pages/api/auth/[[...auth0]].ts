import {
  handleAuth,
  handleLogin,
  handleLogout,
  handleCallback,
  AfterCallback,
} from "@auth0/nextjs-auth0";
import { UserRepository } from "@server/repositories/user.repository";
import { connectMongoDb } from "@server/database/connectMongoDb";
import logger from "@server/logging";

const userRepository = new UserRepository();

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          prompt: "select_account",
        },
      });
    } catch (error: any) {
      logger.error(error);
      res.status(error.status || 500).end(error.message);
    }
  },

  // https://github.com/auth0/nextjs-auth0/issues/362#issuecomment-860711901
  async logout(req, res) {
    await handleLogout(req, res);
  },

  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        afterCallback,
      });
    } catch (error: any) {
      logger.error(error);
      res.status(error.status || 500).end(error.message);
    }
  },
});

const afterCallback: AfterCallback = async (_req, _res, session) => {
  const { user } = session;

  if (user.sub) {
    const userId = user.sub;
    await connectMongoDb();
    await userRepository.getOrCreate(userId);
  }

  return session;
};
