export class Recorder {

    recorder: MediaRecorder;

    constructor(streamDestination: MediaStream) {
       this.recorder = new MediaRecorder(streamDestination);
    }

    startRecording() {
        if (this.recorder.state === 'inactive') {
            this.recorder.start();
        }
    }

    stopRecording() {
        if (this.recorder.state === 'recording') {
            this.recorder.stop();
        }
    }

}
