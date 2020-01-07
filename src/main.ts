import {AudioComponent} from './audio/audio.component';

class Main {
    static run(audioInstance: AudioComponent) {
        console.log(audioInstance);
        audioInstance.run();
    }
}

const main = async() => {
    const { AudioComponent } = await import('./audio/audio.component');
    const audioInstance = new AudioComponent();
        Main.run(audioInstance);

};

main().then(() => console.log('started'));
