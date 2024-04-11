import {Server, Socket} from 'socket.io';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import SimplePeer from "simple-peer";

const wrtc = require('wrtc');

export default class MediaController {
	constructor(
		private readonly io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	) {
		this.start().then()
	}

	async start() {
		this.io.on('connection', (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
			socket.on('offer', (data) => {
				const peerOptions: SimplePeer.Options = {initiator: false, trickle: false, wrtc};

				const peer = new SimplePeer(peerOptions);

				peer.on('signal', signal => {
					socket.emit('answer', signal);
				});

				peer.on('stream', (stream) => {
					console.log(`On Stream ${stream}`)

					const videoTracks = stream.getVideoTracks();
					if (videoTracks.length > 0) {
						console.log('Received video stream');
					} else {
						console.log('Received audio stream only');
					}


				});

				peer.signal(data);
			})

		});
	}
}
