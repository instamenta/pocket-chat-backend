import { BaseRepository } from "../base/repository.base";
import { PopulatedLiveMessageStruct, PopulatedLiveStruct } from "../types/live";
import { LiveStatesUnion } from "../types/union";
export declare class LiveRepository extends BaseRepository {
    createLive(userId: string): Promise<string>;
    listLives(userId: string): Promise<PopulatedLiveStruct[]>;
    getLiveById(liveId: string): Promise<Pick<PopulatedLiveStruct, "id" | "userId" | "state"> | null>;
    updateLiveState(userId: string, state: LiveStatesUnion): Promise<boolean>;
    createLiveMessage(liveId: string, userId: string, content: string): Promise<string>;
    listLiveMessages(liveId: string): Promise<PopulatedLiveMessageStruct[]>;
}
//# sourceMappingURL=live.d.ts.map