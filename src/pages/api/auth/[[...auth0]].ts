import { handleAuth, handleLogin, handleCallback, getSession } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res);
    } catch (error: any) {
      res.status(error.status || 500).end(error.message);
    }
  },
  async callback(req, res) {
    await handleCallback(req, res);

    // const session = getSession(req, res);
    // console.log("SESSION: ", JSON.stringify(session));
  }
});
