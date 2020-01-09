import {AudioComponent} from './audio/audio.component';
import {Recorder} from "./recorder/recorder";

class Main {
    static recorderInstance: Recorder = null;
    static initClickHandlers(elements: Element[], cb: () => any) {
        for ( const el of elements) {
            el.addEventListener('click', () => {
                cb();
            })
        }
    }
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

    // View Layer CTRL:

    if (!Main.recorderInstance) {
        Main.recorderInstance = new Recorder(stream);
    }

    const recBtn1: Element = document.querySelector('#c1');
    const recBtn2: Element = document.querySelector('#c2');
    const recBtn3: Element = document.querySelector('#c3');

    Main.initClickHandlers([recBtn1, recBtn2, recBtn3], () =>  {
        Main.recorderInstance.startRecording()
    });



};

main().then(() => console.log('started'));
