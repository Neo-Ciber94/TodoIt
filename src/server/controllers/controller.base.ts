import { AppApiContext } from "@server/types";
import { BeforeRequest } from "next-controllers";
import { ControllerConfig, AppSession, AuditConfig } from "./types";
import { defaultAuditProps } from "./utils";

export type AuditEvent = "creator" | "updater" | "deleter";

/**
 * The base controller for all API controllers.
 */
export class ControllerBase {
  protected _session: AppSession = {};

  constructor(protected readonly config: ControllerConfig) {
    // This is just used to remove the 'unused' warning.
    console.assert(this.__setSessionData);
  }

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
   * Sets the creator, deleter or updater to the target entity.
   * @param event The event used to set the data.
   * @param target The value to set the data.
   */
  protected setAuditData(event: AuditEvent, target: any) {
    if (target == null || this.config.audit === false) {
      return;
    }

    const userId = this.session.userId;

    if (userId == null) {
      return;
    }

    switch (event) {
      case "creator":
        this.setCreatorUser(userId, target);
        break;
      case "updater":
        this.setUpdaterUser(userId, target);
        break;
      case "deleter":
        this.setDeleterUser(userId, target);
        break;
      default:
        throw new Error(`Invalid audit event: ${event}`);
    }
  }

  private get auditConfig(): AuditConfig {
    if (!this.config.audit || this.config.audit === true) {
      return defaultAuditProps;
    }

    return this.config.audit;
  }

  private setCreatorUser(userId: string, target: any) {
    setUser(userId, this.auditConfig, target, "creator");
  }

  private setUpdaterUser(userId: string, target: any) {
    setUser(userId, this.auditConfig, target, "updater");
  }

  private setDeleterUser(userId: string, target: any) {
    setUser(userId, this.auditConfig, target, "deleter");
  }
}

function setUser(
  userId: string,
  audit: AuditConfig | boolean,
  target: any,
  prop: keyof AuditConfig
) {
  const canSet = typeof audit !== "boolean" && audit[prop] !== false;

  if (!canSet) {
    return;
  }

  const auditProp = audit[prop];
  const propName: string =
    typeof audit === "boolean" || typeof auditProp === "boolean"
      ? defaultAuditProps[prop]
      : auditProp;

  if (Array.isArray(target)) {
    target.forEach((t) => (t[propName] = userId));
  } else {
    target[propName] = userId;
  }
}
