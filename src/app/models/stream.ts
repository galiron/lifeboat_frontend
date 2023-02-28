import { StreamStatus } from "./streamStatus";

export class Stream {
    mediaStream: MediaStream | undefined;
    feedUuid: string;
    audio: boolean;
    video: boolean;
    status: StreamStatus | undefined;
    pc: RTCPeerConnection | undefined;
    uuid: string | undefined;
    localDescription: string | undefined;
    constructor(feedUuid: string, audio: boolean, video: boolean, status?: StreamStatus, mediaStream?: MediaStream, pc?: RTCPeerConnection, uuid?: string){
        this.mediaStream = mediaStream;
        this.feedUuid = feedUuid;
        this.audio = audio;
        this.video = video;
        this.pc = pc;
        this.uuid = uuid
        if(status) {
            this.status = status; 
        } else{
            this.status = new StreamStatus();
        }
    }

    static isContainedInArray(streamArray: Array<Stream>, uuid: string) : boolean {
        for (let entry of streamArray){
            if (entry.uuid == uuid)
                return true
        }
        return false
    }
}
