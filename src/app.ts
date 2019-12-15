import {AudioComponent} from "./audio/audio.component";

class App {
    static run(audioInstance: AudioComponent) {
        console.log(audioInstance);
        audioInstance.run();
    }
}

const main = async() => {
    const { AudioComponent } = await import('./audio/audio.component.js');
    const audioInstance = new AudioComponent();
        App.run(audioInstance);

};

main().then(() => console.log('started'));
