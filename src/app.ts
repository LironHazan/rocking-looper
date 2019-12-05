import {AudioCtrl} from "./audio/audio.ctrl";

class App {
    static run(audioInstance: AudioCtrl) {
        console.log(audioInstance);
        audioInstance.playSweep({});
    }
}

const main = async() => {
    const { AudioCtrl } = await import('./audio/audio.ctrl.js');
    const audioInstance = new AudioCtrl();
        App.run(audioInstance);

};

main().then(() => console.log('started'));
