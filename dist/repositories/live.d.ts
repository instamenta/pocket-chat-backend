import { BaseRepository } from "../base/repository.base";
import * as T from '../types';
export default class LiveRepository extends BaseRepository {
    createLive(userId: string): Promise<string>;
    listLives(userId: string): Promise<T.Live.Populated[]>;
    getLiveById(liveId: string): Promise<{
        id: string;
        state: string;
        user_id: string;
    } | null>;
    updateLiveState(userId: string, state: T.U.LiveStates): Promise<boolean>;
    createLiveMessage(liveId: string, userId: string, content: string): Promise<string>;
    listLiveMessages(liveId: string): Promise<T.Live.MessagePopulated[]>;
}
//# sourceMappingURL=live.d.ts.map