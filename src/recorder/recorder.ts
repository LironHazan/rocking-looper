const WORKER_PATH = './worker.ts';

export class Recorder {

    recorder: MediaRecorder;

    constructor(streamDestination: any) {
       this.recorder = new MediaRecorder(streamDestination);
    }

    startRecording() {
        // ?? this.recorder.start()
    }

    clearRecording() {
        // ?? this.recorder.clear()
    }

}