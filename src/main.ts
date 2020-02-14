enum State {
    start = 'start',
    rec = 'rec',
    play = 'play',
    stop = 'stop',
}

interface LooperActionRef { id: number, el: HTMLElement, btnState: State, playable: HTMLAudioElement, blob: Blob }

class LooperComponent {
    static pressedElement: LooperActionRef;
    static elements: LooperActionRef[];
    stream: MediaStream;
    mediaRecorder: MediaRecorder;

    constructor() {
        // looper buttons
        const first: HTMLElement = document.querySelector('.first');
        const second: HTMLElement = document.querySelector('.second');
        const third: HTMLElement = document.querySelector('.third');

        LooperComponent.elements = [
            { id: 1, el: first, btnState: State.start, playable: null, blob: null },
            { id: 2, el: second, btnState: State.start, playable: null, blob: null  },
            { id: 3, el: third, btnState: State.start, playable: null, blob: null  }
            ];

        this.attachClickListeners(LooperComponent.elements);
    }

    static reset(element: LooperActionRef) {
        element.btnState = State.start;
        element.el.children[0].textContent = element.btnState;
        element.el.classList.remove(State.stop);
        element.el.classList.remove(State.rec);
        element.el.classList.remove(State.play);
    }

    private attachClickListeners(elements: LooperActionRef[]) {
        for (const element of elements) {
            element.el.onclick = () => {
                this.setupTrackState(element);
            };
            element.el.ondblclick = () => {
                LooperComponent.reset(element);
            };
        }
    };

    private setupTrackState(element: LooperActionRef) {
        switch(element.btnState) {
            case State.start:
                element.btnState = State.rec;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add('rec');

                // User clicked START so start recording input stream
                LooperComponent.pressedElement = element;
                this.mediaRecorder && this.mediaRecorder.start();
                break;

            case State.rec:
                element.btnState = State.play;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.remove(State.rec);
                element.el.classList.add(State.play);

                // Stop recording
                LooperComponent.pressedElement = element;
                this.mediaRecorder && this.mediaRecorder.stop();

                break;

            case State.play:
                element.btnState = State.stop;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add(State.stop);
                element.el.classList.remove(State.play);

                // Stop playing
                element.playable && element.playable.pause();
                break;

            case State.stop:
                element.btnState = State.play;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add(State.play);
                element.el.classList.remove(State.stop);

                // Play again
                element.playable && element.playable.play();
                break;

            default:
        }
    };

    async start () {
        // Getting permission status.
        await navigator.permissions.query({name: 'microphone'});

        // Streaming audio:
        await this.setupAudioLine();

        // Recording streamed audio!
        await this.setupRecorder();
    }

    private async setupAudioLine() {
        const context = new AudioContext();

        if (context.state === 'suspended') {
            await context.resume();
        }

        this.stream = await navigator.mediaDevices
            .getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    latency: 0
                }
            });

        const lineInSource = context.createMediaStreamSource(this.stream);
        lineInSource.connect(context.destination);
    }

    private async setupRecorder() {
        this.mediaRecorder = new MediaRecorder(this.stream);
        let chunks: Blob[] = [];

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
            chunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
            for (const btn of LooperComponent.elements) {
                if (LooperComponent.pressedElement.id === btn.id) {
                    btn.blob = new Blob(chunks, {
                        'type' : 'audio/ogg; codecs=opus',
                    });
                    // Reset chunks
                    chunks = [];

                    const src = btn.blob &&  URL.createObjectURL(btn.blob);
                    if (!src) return;
                    btn.playable = new Audio(src);
                    btn.playable.loop =  true;
                    btn.playable.play();
                }
            }

        };
    }
}

const main = async() => {
    const looper = new LooperComponent();
    await looper.start();
};

main()
    .then(() => console.log('started'));
