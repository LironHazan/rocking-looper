export class AudioCtrl {
    audioCtx: AudioContext;

    constructor() {
        this.audioCtx = new window.AudioContext();
    }

    playSweep(wave: PeriodicWave) {
        const osc = this.audioCtx.createOscillator();
        osc.setPeriodicWave(wave);
        osc.frequency.value = 440;
        osc.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 1);
    }
}
