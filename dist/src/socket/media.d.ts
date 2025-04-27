import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
export default class MediaController {
    private readonly io;
    constructor(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>);
    start(): Promise<void>;
}
//# sourceMappingURL=media.d.ts.map