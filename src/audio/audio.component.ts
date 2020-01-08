import {AudioCmdService} from './audio-cmd.service';

export class AudioComponent {
    audioCtx: AudioContext;
    lineInSource: any;

    constructor() {
        this.audioCtx = AudioCmdService.createContextRef();
    }

    // - Create a context from streamed blobs - mic connection
    // - Add nodes like bieq and gain
    // - Connect a filter before connecting destination ?
    // - Maintain a layer of web workers as the looper channels?

    async run() {
        const ctx = AudioCmdService.createContextRef();
        // AudioCmdService.mediaStreamRef(ctx, );

        // request user input with getUserMedia - todo: should be done outside as part of a recording act

        const context = new AudioContext({ latencyHint: 'interactive' });

        if (context.state === 'suspended') {
            await context.resume();
        }

        if (!this.lineInSource) {
            const mediaStream = await navigator.mediaDevices
                .getUserMedia({
                    audio: {
                        echoCancellation: false,
                        autoGainControl: false,
                        noiseSuppression: false,
                        latency: 0
                    }
                });
            this.lineInSource = context.createMediaStreamSource(mediaStream);
            this.lineInSource.connect(context.destination);
        }

        // Getting permission status.
        const micStatus = await navigator.permissions.query({name: 'microphone'});

        console.log(micStatus); // state: "prompt"

    }
}
