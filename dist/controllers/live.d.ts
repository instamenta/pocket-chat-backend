import { Request, Response } from "express";
import LiveRepository from "../repositories/live";
import { BaseController } from "../base/controller.base";
import * as T from '../types';
export default class LiveController extends BaseController<LiveRepository> {
    createLive(request: Request<object, object>, response: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listLives(request: Request, response: Response<T.Live.Populated[]>): Promise<void>;
    listLiveMessages(request: Request<{
        liveId: string;
    }>, response: Response<T.Live.MessagePopulated[]>): Promise<void>;
    updateLiveState(request: Request<{
        state: T.U.LiveStates;
    }>, response: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=live.d.ts.map