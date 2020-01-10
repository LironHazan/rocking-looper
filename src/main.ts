import { AudioComponent } from './audio/audio.component';
import { Recorder } from './recorder/recorder';
import { LooperUserInteractionLayer } from './ui/LooperUserInteractionLayer';

class Main {
    static recorderInstance: Recorder = null;

    static clearRecorderInstance() {
        Main.recorderInstance = null;
    }
}

const main = async() => {
    // Getting permission status.
    await navigator.permissions.query({name: 'microphone'});

    const playerWorker = new Worker('media-player-worker.js');
    const audioInstance = new AudioComponent();
    const stream = await audioInstance.getlineInSource();
    const audioChunks: any[] = [];

    if (!Main.recorderInstance) {
            Main.recorderInstance = new Recorder(stream);

        Main.recorderInstance.recorder.
        addEventListener('dataavailable', (event: any) => {
            audioChunks.push(event.data);
        });
    }
    // View Layer CTRL
    LooperUserInteractionLayer.setupLooperUserInteractions(Main.recorderInstance, audioChunks, playerWorker);
    playerWorker.onmessage =  (e) => {
        console.log('Message received from worker');
        console.log(e);
    };

};

main()
    .then(() => console.log('started'));
