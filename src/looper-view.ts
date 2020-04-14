
interface ObserverType { observers: ActionType[], on: Function, dispatch: Function }
interface ActionType { name: string, fn: Function}

export enum State {
    start = 'start',
    rec = 'rec',
    play = 'play',
    stop = 'stop',
}
export interface LooperActionRef { id: number, el: HTMLElement, btnState: State, playable: HTMLAudioElement, blob: Blob }

export class LooperViewLayer {
    static elements: LooperActionRef[];
    static lastPressedBtnId: number;

    // Simple observer implementation
    static viewInteractionSubject: ObserverType = {
        observers: [],

        on: (action: ActionType) => {
            LooperViewLayer.viewInteractionSubject.observers.push(action);
        },

        dispatch: <T>(name: string, arg?: T) => {
            if (LooperViewLayer.viewInteractionSubject.observers.length === 0) return;
            const exec = LooperViewLayer.viewInteractionSubject.observers
                .find((event) => event.name === name);
            exec.fn(arg);
        }
    };

    static initView() {
        // Looper's buttons
        const first: HTMLElement = document.querySelector('.first');
        const second: HTMLElement = document.querySelector('.second');
        const third: HTMLElement = document.querySelector('.third');

        LooperViewLayer.elements = [
            { id: 1, el: first, btnState: State.start, playable: null, blob: null },
            { id: 2, el: second, btnState: State.start, playable: null, blob: null  },
            { id: 3, el: third, btnState: State.start, playable: null, blob: null  }
        ];

        LooperViewLayer.attachClickListeners(LooperViewLayer.elements)
    }

    static reset(element: LooperActionRef) {
        element.btnState = State.start;
        element.el.children[0].textContent = element.btnState;
        element.el.classList.remove(State.stop);
        element.el.classList.remove(State.rec);
        element.el.classList.remove(State.play);
    }

    private static attachClickListeners(elements: LooperActionRef[]) {
        for (const element of elements) {
            element.el.onclick = () => {
                LooperViewLayer.setupTrackState(element);
            };
            element.el.ondblclick = () => {
                LooperViewLayer.reset(element);
            };
        }
    };

    static setupTrackState(element: LooperActionRef) {
        switch(element.btnState) {

            case State.start:
                element.btnState = State.rec;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add('rec');

                // User clicked START so start recording input stream
                // emit event
                LooperViewLayer.viewInteractionSubject.dispatch('startRecording');
                LooperViewLayer.lastPressedBtnId = element.id;
                break;

            case State.rec:
                element.btnState = State.play;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.remove(State.rec);
                element.el.classList.add(State.play);

                // Stop recording
                LooperViewLayer.viewInteractionSubject.dispatch('stopRecording');
                LooperViewLayer.lastPressedBtnId = element.id;
                break;

            case State.play:
                element.btnState = State.stop;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add(State.stop);
                element.el.classList.remove(State.play);

                // Stop playing
                LooperViewLayer.viewInteractionSubject.dispatch('pausePlaying', element);
                break;

            case State.stop:
                element.btnState = State.play;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add(State.play);
                element.el.classList.remove(State.stop);

                // Play again
                LooperViewLayer.viewInteractionSubject.dispatch('resumePlaying', element.id);
                break;

            default:
        }
    };

}
