import { Request, Response } from "express";
import LiveRepository from "../repositories/live";
import BaseController from "../base/controller.base";
import * as T from '../types';
export default class LiveController extends BaseController<LiveRepository> {
    createLive(r: Request<object, object>, w: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listLives(r: Request, w: Response<T.Live.Populated[]>): Promise<void>;
    listLiveMessages(r: Request<{
        liveId: string;
    }>, w: Response<T.Live.MessagePopulated[]>): Promise<void>;
    updateLiveState(r: Request<{
        state: T.U.LiveStates;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=live.d.ts.map