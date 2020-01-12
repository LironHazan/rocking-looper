import {Recorder} from '../recorder/recorder';

export class LooperUserInteractionLayer {

    private static initClickHandlers(elements: Element[], cb: () => any) {
        for ( const el of elements) {
            el.addEventListener('click', () => {
                cb();
            });
        }
    }

    static setupLooperUserInteractions<T>(recorderInstance: Recorder, stream: T[], worker: Worker) {
        const loopAll: Element = document.querySelector('#loop');
        const stopLooping: Element = document.querySelector('#stop-looping');

        const recBtn1: Element = document.querySelector('#c1');
        const recBtn2: Element = document.querySelector('#c2');
        const recBtn3: Element = document.querySelector('#c3');

        const stopRecBtn1: Element = document.querySelector('#s1');
        const stopRecBtn2: Element = document.querySelector('#s2');
        const stopRecBtn3: Element = document.querySelector('#s3');

        LooperUserInteractionLayer.initClickHandlers([recBtn1, recBtn2, recBtn3], () =>  {
            recorderInstance.startRecording();
        });

        LooperUserInteractionLayer.initClickHandlers([stopRecBtn1, stopRecBtn2, stopRecBtn3], () =>  {
            recorderInstance.stopRecording();
        });

        // be able to play all recordings
        LooperUserInteractionLayer.initClickHandlers([loopAll], () =>  {

            // Passing blobs to the worker player
            for (const blob of stream) {
                worker.postMessage(blob);
            }
            console.log(stream);

        });

        LooperUserInteractionLayer.initClickHandlers([stopLooping], () =>  {
            // cleanups
        });
    }

}
