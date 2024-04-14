import {Server, Socket} from 'socket.io';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import SimplePeer from "simple-peer";

const wrtc = require('wrtc');

export default class MediaController {

	constructor(
		private readonly io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) {
		this.start().then();
	}

	async start() {
		this.io.on('connection', (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
			socket.on('offer', (data) => {
				const peer = new SimplePeer({initiator: false, trickle: false, wrtc});

				peer.on('signal', signal => {
					socket.emit('answer', signal);
				});

				peer.on('stream', (stream) => {
					console.log(`On Stream ${stream}`);

					// @ts-ignore
					this.forwardStreamToMediaServer(stream);
				});

				peer.signal(data);
			});
		});
	}
}
