import {AudioCmdService} from "./audio-cmd.service";

export class AudioComponent {
    audioCtx: AudioContext;

    constructor() {
        this.audioCtx = AudioCmdService.createContextRef();
    }

    // - Create a context from streamed blobs - mic connection
    // - Add nodes like bieq and gain
    // - Connect a filter before connecting destination ?
    // - Maintain a layer of web workers as the looper channels?

    run() {
        const ctx = AudioCmdService.createContextRef();
        // AudioCmdService.mediaStreamRef(ctx, );

        const osc = this.audioCtx.createOscillator();
        osc.type = 'square';
       // osc.setPeriodicWave(wave);
        osc.frequency.value = 440;
        osc.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 1);
    }
}
