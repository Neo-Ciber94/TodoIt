import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          prompt: "select_account",
        },
      });
    } catch (error: any) {
      res.status(error.status || 500).end(error.message);
    }
  },

  // https://github.com/auth0/nextjs-auth0/issues/362#issuecomment-860711901
  async logout(req, res) {
    await handleLogout(req, res);
  },
});

const COMPLETED = Promise.resolve<void>(undefined);
