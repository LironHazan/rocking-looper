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

let btnState: State = State.start;
let blob: Blob;
let stream;
let mediaRecorder: MediaRecorder;

const handleTrack = function() {
    // switch case

    if (btnState === State.start) {

        mediaRecorder.start();
    }

    if (btnState === State.rec) {

        mediaRecorder.stop();

        const src = URL.createObjectURL(blob);
        const playable = new Audio(src);
        playable.loop =  true;
        playable.play();
        btnState = State.play;
    }
    else if (btnState === State.play) {

    }
};

const attachClickListeners = (elements: HTMLButtonElement[]) => {
    for (const el of elements) {
        el.onclick = () => {
            handleTrack();
        };
    }
};

const main = async() => {

    const first: HTMLButtonElement = document.querySelector('.first');
    const second: HTMLButtonElement = document.querySelector('.second');
    const third: HTMLButtonElement = document.querySelector('.third');

    // Getting permission status.
   await navigator.permissions.query({name: 'microphone'});

    // Streaming audio:
    const context = new AudioContext();
    if (context.state === 'suspended') {
        await context.resume();
    }

    stream = await navigator.mediaDevices
        .getUserMedia({
            audio: {
                echoCancellation: false,
                autoGainControl: false,
                noiseSuppression: false,
                latency: 0
            }
        });
    const lineInSource = context.createMediaStreamSource(stream);
    lineInSource.connect(context.destination);

    // Recording streamed audio!
    mediaRecorder = new MediaRecorder(stream);
    let chunks: any[] = [];

    mediaRecorder.ondataavailable = <T extends { data: any }>(event: T) => {
        chunks.push(event.data);
    };

    attachClickListeners([first, second, third]);

    mediaRecorder.onstop = (event) => {
        blob = new Blob(chunks, {
            'type' : 'audio/ogg; codecs=opus',
        });
        chunks = [];
    };
};

main()
    .then(() => console.log('started'));
