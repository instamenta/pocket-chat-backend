import { BaseRepository } from "../base/repository.base";
import * as T from "../types";
export declare class LiveRepository extends BaseRepository {
    createLive(userId: string): Promise<string>;
    listLives(userId: string): Promise<T.Live.PopulatedLiveStruct[]>;
    getLiveById(liveId: string): Promise<{
        id: string;
        state: string;
        user_id: string;
    } | null>;
    updateLiveState(userId: string, state: T.U.LiveStatesUnion): Promise<boolean>;
    createLiveMessage(liveId: string, userId: string, content: string): Promise<string>;
    listLiveMessages(liveId: string): Promise<T.Live.PopulatedLiveMessageStruct[]>;
}
//# sourceMappingURL=live.d.ts.map