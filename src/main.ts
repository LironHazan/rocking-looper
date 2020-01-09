import {AudioComponent} from './audio/audio.component';
import {Recorder} from "./recorder/recorder";
import {LooperUserInteractionLayer} from "./ui/LooperUserInteractionLayer";

class Main {
    static recorderInstance: Recorder = null;
    static clearRecorderInstance() {
        Main.recorderInstance = null;
    }
}

const main = async() => {
    // Getting permission status.
    await navigator.permissions.query({name: 'microphone'});

    const { AudioComponent } = await import('./audio/audio.component');
    const audioInstance = new AudioComponent();
    const stream = audioInstance.run();

    if (!Main.recorderInstance) {
        // todo: resolve type
        Main.recorderInstance = new Recorder(stream);
    }
    // View Layer CTRL
    LooperUserInteractionLayer.setupLooperUserInteractions(Main.recorderInstance);

};

main().then(() => console.log('started'));
