// state machine:
// start --> click | white
// rec --> click | red
// play --> click | green
// stop --> click | blue
// play
// any action but start --> double click
// start


const addTrack = function(blob: Blob) {
    // Init Selectors
    const first: HTMLButtonElement = document.querySelector('.first');
    const second: HTMLButtonElement = document.querySelector('.second');
    const third: HTMLButtonElement = document.querySelector('.third');


    first.onclick = function() {
        // templatePlay.disabled = false;
        // templatePause.disabled = true;
        // templateAudio.pause();

        const src = URL.createObjectURL(blob);
        const playable = new Audio(src);
        playable.loop =  true;
        playable.play();
    };
};

const main = async() => {
    // Streaming audio:

    // Getting permission status.
   await navigator.permissions.query({name: 'microphone'});

    const context = new AudioContext();
    if (context.state === 'suspended') {
        await context.resume();
    }

    const stream = await navigator.mediaDevices
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
    let mediaRecorder = new MediaRecorder(stream);
    let chunks: any[] = [];

    let startRecord = () => {
        mediaRecorder.start();
    };
    let stopRecord = () => {
        mediaRecorder.stop();
    };

    mediaRecorder.ondataavailable = <T extends { data: any }>(event: T) => {
        chunks.push(event.data);
    };

    // Playing recorded stream
    mediaRecorder.onstop = (event) => {
        let blob = new Blob(chunks, {
            'type' : 'audio/ogg; codecs=opus',
        });
        chunks = [];
        addTrack(blob);
    };
};

main()
    .then(() => console.log('started'));
