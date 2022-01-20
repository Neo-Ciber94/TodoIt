import { AppApiContext } from "@server/types";
import { BeforeRequest } from "next-controllers";
import { ControllerConfig, AppSession, AuditConfig } from "./types";
import { defaultAuditProps } from "./utils";

const USER_PROP = "creatorUserId";

export type AuditEvent = "create" | "update" | "delete";

/**
 * The base controller for all API controllers.
 */
export class ControllerBase {
  protected _session: AppSession = {};

  constructor(protected readonly config: ControllerConfig) {}

  /**
   * Current session data.
   */
  protected get session(): AppSession {
    return this._session;
  }

  // Sets the current session data from the request
  @BeforeRequest()
  private __setSessionData({ request }: AppApiContext) {
    if (this.config.useSession === false) {
      return;
    }

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

  protected setAuditData(event: AuditEvent, target: any) {
    if (target == null || this.config.audit === false) {
      return;
    }

    const userId = this.session.userId;

    if (userId == null) {
      return;
    }

    switch (event) {
      case "create":
        this.setCreatorUser(userId, target);
        break;
      case "update":
        this.setUpdaterUser(userId, target);
        break;
      case "delete":
        this.setDeleterUser(userId, target);
        break;
      default:
        break;
    }
  }

  protected setCreatorUser(userId: string, target: any) {
    const audit = this.config.audit!;
    const propName: string =
      typeof audit === "boolean" || typeof audit.create === "boolean"
        ? defaultAuditProps.create
        : audit.create;

    target[propName] = userId;
  }

  protected setUpdaterUser(userId: string, target: any) {
    const audit = this.config.audit!;
    const propName: string =
      typeof audit === "boolean" || typeof audit.update === "boolean"
        ? defaultAuditProps.update
        : audit.update;

    target[propName] = userId;
  }

  protected setDeleterUser(userId: string, target: any) {
    const audit = this.config.audit!;
    const propName: string =
      typeof audit === "boolean" || typeof audit.delete === "boolean"
        ? defaultAuditProps.delete
        : audit.delete;

    target[propName] = userId;
  }
}
