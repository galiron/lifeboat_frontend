export class StreamStatus {
  hasAudio: boolean;
  hasVideo: boolean;

  constructor(hasAudio?: boolean, hasVideo?: boolean) {
    if (hasAudio) {
      this.hasAudio = false;
    } else {
      this.hasAudio = false;
    }
    if (hasVideo) {
      this.hasVideo = true;
    } else {
      this.hasVideo = false;
    }
  }
}
