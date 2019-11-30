import {AudioCtrl} from "./audio/audio.ctrl";

class App {

    static run() {
        new AudioCtrl().playSweep({});
    }
}

App.run();
