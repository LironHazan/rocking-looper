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

class LooperComponent {
    btnState: State = State.start;
    blob: Blob;
    stream: MediaStream;
    mediaRecorder: MediaRecorder;

    constructor() {
        // buttons
        const first: HTMLButtonElement = document.querySelector('.first');
        const second: HTMLButtonElement = document.querySelector('.second');
        const third: HTMLButtonElement = document.querySelector('.third');

        this.attachClickListeners([first, second, third]);
    }

    setupTrackState() {
        let playable: HTMLAudioElement;

        // replace with switch case
        if (this.btnState === State.start) {
            this.mediaRecorder.start();
            return;
        }

        if (this.btnState === State.rec) {
            this.mediaRecorder.stop();
            const src = URL.createObjectURL(this.blob);
            playable = new Audio(src);
            playable.loop =  true;
            playable.play();
            this.btnState = State.play;
            return;
        }

        if (this.btnState === State.play) {
            playable.pause();
            return;

        }

        if (this.btnState === State.stop) {
            playable.play();
            return;
        }
    };

    attachClickListeners(elements: HTMLButtonElement[]) {
        for (const el of elements) {
            el.onclick = () => {
                this.setupTrackState();
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
