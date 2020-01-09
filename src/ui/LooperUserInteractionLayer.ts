import {Recorder} from "../recorder/recorder";

export class LooperUserInteractionLayer {

    private static initClickHandlers(elements: Element[], cb: () => any) {
        for ( const el of elements) {
            el.addEventListener('click', () => {
                cb();
            })
        }
    }

    static setupLooperUserInteractions(recorderInstance: Recorder) {
        const loopAll: Element = document.querySelector('#loop');
        const stopLooping: Element = document.querySelector('#stop-looping');

        const recBtn1: Element = document.querySelector('#c1');
        const recBtn2: Element = document.querySelector('#c2');
        const recBtn3: Element = document.querySelector('#c3');

        const stopRecBtn1: Element = document.querySelector('#s1');
        const stopRecBtn2: Element = document.querySelector('#s2');
        const stopRecBtn3: Element = document.querySelector('#s3');

        LooperUserInteractionLayer.initClickHandlers([recBtn1, recBtn2, recBtn3], () =>  {
            recorderInstance.startRecording()
        });

        LooperUserInteractionLayer.initClickHandlers([stopRecBtn1, stopRecBtn2, stopRecBtn3], () =>  {
            recorderInstance.stopRecording()
        });

        LooperUserInteractionLayer.initClickHandlers([loopAll], () =>  {
            // invoke worker player
        });
        LooperUserInteractionLayer.initClickHandlers([stopLooping], () =>  {
            // invoke worker player
        });
    }

}
