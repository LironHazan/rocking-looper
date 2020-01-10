
onmessage = (e) => {
    console.log('Worker: Message received from main script');

    postMessage('start playing', '');
    console.log('Do something', e);
    postMessage('done', '');
};
