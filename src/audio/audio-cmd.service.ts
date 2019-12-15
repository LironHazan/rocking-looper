export class AudioCmdService {

    static createContextRef(): AudioContext {
        return new AudioContext();
    }

    static mediaStreamRef(ctx: AudioContext, mediaStream: MediaStream): MediaStreamAudioSourceNode {
        return ctx.createMediaStreamSource(mediaStream)
    }
}
