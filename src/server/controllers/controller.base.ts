import { AppApiContext } from "@server/types";
import { BeforeRequest } from "next-controllers";
import { AppControllerConfig, AppSession } from "./types";

const USER_PROP = "creatorUserId";

export class ControllerBase {
  private _session: AppSession = {};

  constructor(protected readonly config: AppControllerConfig) {}

  /**
   * Current session data
   */
  protected get session() {
    return this._session;
  }

  // Sets the current session data from the request
  @BeforeRequest()
  private __setSessionData({ request }: AppApiContext) {
    const userId = request.userId;

    if (userId) {
      this._session = { userId };
    }
  }

  /**
   * Sets the session data to the given value.
   * @param target The object to set the session data.
   */
  protected setSessionData(target: any) {
    if (target == null) {
      return;
    }

    const userId = this.session.userId;

    if (userId) {
      target[this.config.userPropertyName || USER_PROP] = userId;
    }
  }
}
