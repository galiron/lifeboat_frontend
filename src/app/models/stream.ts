import { StreamStatus } from "./streamStatus";

export class Stream {
    mediaStream: MediaStream;
    uuid: string;
    audio: boolean;
    video: boolean;
    pc: RTCPeerConnection;
    status: StreamStatus;
    constructor(mediaStream: MediaStream, uuid: string, audio: boolean, video: boolean, pc: RTCPeerConnection, status?: StreamStatus){
        this.mediaStream = mediaStream;
        this.uuid = uuid;
        this.audio = audio;
        this.video = video;
        this.pc = pc;
        if(status) {
            this.status = status; 
        } else{
            this.status = new StreamStatus();
        }
    }
}
