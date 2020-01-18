// state machine:
// start --> click | white
// rec --> click | red
// play --> click | green
// stop --> click | blue
// play
// any action but start --> double click
// start

enum State {
    start = 'start',
    rec = 'rec',
    play = 'play',
    stop = 'stop',
}

interface LooperActionRef { el: HTMLElement, btnState: State }

class LooperComponent {
    blob: Blob;
    stream: MediaStream;
    mediaRecorder: MediaRecorder;

    constructor() {
        // buttons
        const first: HTMLElement = document.querySelector('.first');
        const second: HTMLElement = document.querySelector('.second');
        const third: HTMLElement = document.querySelector('.third');

        this.attachClickListeners(
            [{ el: first, btnState: State.start },
                { el: second, btnState: State.start },
                { el: third, btnState: State.start }]);
    }

    setupTrackState(element: LooperActionRef) {
        let playable: HTMLAudioElement;

        switch(element.btnState) {
            case State.start:
                element.btnState = State.rec;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add('rec');

                // User clicked START so start recording input stream
                this.mediaRecorder.start();
                break;

            case State.rec:
                element.btnState = State.play;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.remove(State.rec);
                element.el.classList.add(State.play);

                // Stop recording and start playing the track in loop

                this.mediaRecorder.stop();
                const src = URL.createObjectURL(this.blob);
                playable = new Audio(src);
                playable.loop =  true;
                playable.play();
                break;

            case State.play:
                element.btnState = State.stop;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add(State.stop);
                element.el.classList.remove(State.play);

                // Stop playing
                playable && playable.pause();
                break;

            case State.stop:
                element.btnState = State.play;
                element.el.children[0].textContent = element.btnState;
                element.el.classList.add(State.play);
                element.el.classList.remove(State.stop);

                // Play again
                playable && playable.play();
                break;

            default:
        }
    };

    reset(element: LooperActionRef) {
        element.btnState = State.start;
        element.el.children[0].textContent = element.btnState;
        element.el.classList.remove(State.stop);
        element.el.classList.remove(State.rec);
        element.el.classList.remove(State.play);
    }

    attachClickListeners(elements: LooperActionRef[]) {
        for (const element of elements) {
            element.el.onclick = () => {
                this.setupTrackState(element);
            };
            element.el.ondblclick = () => {
                this.reset(element);
            };
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
            this.blob = new Blob(chunks, {
                'type' : 'audio/ogg; codecs=opus',
            });
            // Reset chunks
            chunks = [];
        };
    }
}

const main = async() => {
    const looper = new LooperComponent();
    await looper.start();
};

main()
    .then(() => console.log('started'));
