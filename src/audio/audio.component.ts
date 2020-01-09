
export class AudioComponent {
    audioCtx: AudioContext;
    lineInSource: MediaStreamAudioSourceNode;

    constructor() {}

    // - Create a context from streamed blobs - mic connection
    // - Add nodes like bieq and gain
    // - Connect a filter before connecting destination ?
    // - Maintain a layer of web workers as the looper channels?

    async run() {
        this.audioCtx = new AudioContext({ latencyHint: 'interactive' });

        if (this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
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

            this.lineInSource = this.audioCtx.createMediaStreamSource(mediaStream);
            this.lineInSource.connect(this.audioCtx.destination);
        }
        return this.lineInSource.mediaStream;
    }
}
