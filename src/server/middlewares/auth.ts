import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequestWithUser } from "@server/types";
import { NextApiResponse } from "next";
import { NextHandler } from "next-controllers";

export default function authMiddleware() {
  // prettier-ignore
  return async (req: NextApiRequestWithUser, res: NextApiResponse, next: NextHandler) => {
    const session = getSession(req, res);

    if (session == null) {
      return res.status(401).send("Unauthorized");
    }

    const { user } = session;
    if (!('sub' in user)) {
      return res.status(401).send("Cannot find user id");
    }

    req.userId = user.sub;
    next();
  };
}
