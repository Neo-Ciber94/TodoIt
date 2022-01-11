import { getSession, getAccessToken } from "@auth0/nextjs-auth0";
import { NextApiRequestWithUser } from "@server/types";
import { NextApiResponse } from "next";
import { NextHandler } from "next-controllers";

export default function authMiddleware() {
  return async (
    req: NextApiRequestWithUser,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    const session = getSession(req, res);
    const token = await getAccessToken(req, res);

    console.log({ session, token });

    if (session == null) {
      return res.status(401).send("Unauthorized");
    }

    const { idToken } = session;
    req.userId = idToken;
    next();
  };
}
