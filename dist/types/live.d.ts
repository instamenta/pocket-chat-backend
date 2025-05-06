import { LiveStatesUnion } from "./union";
export interface PopulatedLiveStruct {
    userId: string;
    userPicture: string;
    username: string;
    firstName: string;
    lastName: string;
    state: LiveStatesUnion;
    createdAt: string;
    id: string;
}
export interface PopulatedLiveMessageStruct {
    messageId: string;
    userId: string;
    userPicture: string;
    username: string;
    firstName: string;
    lastName: string;
    content: string;
    liveId: string;
    createdAt: string;
}
//# sourceMappingURL=live.d.ts.map