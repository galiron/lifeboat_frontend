import { Component, ElementRef, Input, ViewChild, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, HostListener, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { timeout } from 'rxjs';
import { Stream } from 'src/app/models/stream';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements AfterViewInit{
  streams!: Array<MediaStream>;
  videoWidth!: number;
  videoHeight!: number;
  @Input() set videoWidthBinding(value: number) {
    this.videoWidth = value;
    this.resizeVideo()
    this.reloadVideos()
  }
  @Input() set videoHeightBinding(value: number) {
    this.videoHeight = value;
    this.resizeVideo()
    this.reloadVideos()
  }
  @Input() set setStreams(streams: Array<MediaStream>) {
    this.streams = streams;
    if (this.streams){
      this.reloadVideos()
      this.resizeVideo()
    }
  }
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('audioElement') audioElement!: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize() {
    setTimeout(() => {
      this.resizeVideo()
      this.reloadVideos()
    }, 1);
  }
  currentStreamIndex: number = 0;
  constructor(private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2, private sanitizer: DomSanitizer,) {
  }
  ngAfterViewInit(): void {
      this.resizeVideo()
      this.reloadVideos()
  }
  reloadVideos() {
    this.changeDetectorRef.detectChanges();
    if(this.streams && this.videoElement) {
      let video = this.videoElement.nativeElement;
      var isPlaying = video.currentTime > 0 && !video.paused && !video.ended 
          && video.readyState > video.HAVE_CURRENT_DATA;
      if (!isPlaying) {
        video.play();
      } 
    }
  }

  resizeVideo() {
    if(this.videoElement){
      this.renderer.setStyle(this.videoElement.nativeElement, "width", `${this.videoWidth}px`);
      this.renderer.setStyle(this.videoElement.nativeElement, "height", `${this.videoHeight}px`);
      this.videoHeight = this.videoElement.nativeElement.offsetHeight;
      this.videoWidth = this.videoElement.nativeElement.offsetWidth;
      this.changeDetectorRef.detectChanges();
    }    
  }

  nextSlide() {
    if (this.currentStreamIndex < this.streams.length - 1) {
      this.currentStreamIndex++;
    } else {
      this.currentStreamIndex = 0
    }
  }
  previousSlide() {
    if (this.currentStreamIndex > 0) {
      this.currentStreamIndex--;
    }
    this.currentStreamIndex = this.setStreams.length - 1
  }

  
}
