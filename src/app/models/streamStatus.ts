export class StreamStatus {
    hasVideo: boolean;
    hasAudio: boolean;
    constructor(hasVideo?: boolean, hasAudio?: boolean){
        if(hasVideo){
            this.hasVideo = true;
        } else {
            this.hasVideo = false;
        }
        if(hasAudio){
            this.hasAudio = false;
        } else {
            this.hasAudio = false;
        }
    }
}