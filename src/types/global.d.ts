import { UserDataPayloadStruct } from "./user";

declare global {
  namespace Express {
    export interface Request {
      user: UserDataPayloadStruct;
    }
  }
}