import {AudioCmdService} from './audio-cmd.service';

export class AudioComponent {
    audioCtx: AudioContext;

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

        const context = new AudioContext();

        if (context.state === 'suspended') {
            await context.resume();
        }

        const stream = await navigator.mediaDevices
            .getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    latency: 0
                }
            });
        const lineInSource = context.createMediaStreamSource(stream);

        lineInSource.connect(context.destination);

        // Getting permission status.
        const micStatus = await navigator.permissions.query({name: 'microphone'});

        console.log(micStatus); // state: "prompt"

    }
}
