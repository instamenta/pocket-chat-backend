import { Request, Response } from "express";
import LiveRepository from "../repositories/live";
import BaseController from "../base/controller.base";
import * as T from '../types';
export default class LiveController extends BaseController<LiveRepository> {
    createLive(r: Request<{}, {}>, w: Response<{
        id: string;
    }>): Promise<Response<{
        id: string;
    }, Record<string, any>> | undefined>;
    listLives(r: Request, w: Response<T.Live.Populated[]>): Promise<Response<T.Live.Populated[], Record<string, any>> | undefined>;
    listLiveMessages(r: Request<{
        liveId: string;
    }>, w: Response<T.Live.MessagePopulated[]>): Promise<Response<T.Live.MessagePopulated[], Record<string, any>> | undefined>;
    updateLiveState(r: Request<{
        state: T.U.LiveStates;
    }>, w: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=live.d.ts.map