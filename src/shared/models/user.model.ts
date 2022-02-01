import { WithTimeStamp } from "./audit";

export interface IUser extends WithTimeStamp {
  id: string;
  userId: string;
  isInitialized: boolean;
}
