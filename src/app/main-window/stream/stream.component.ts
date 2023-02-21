import { Component, ElementRef, Input, ViewChild, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef, HostListener, Renderer2 } from '@angular/core';
import { timeout } from 'rxjs';
import { Stream } from 'src/app/models/stream';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements AfterViewInit{
  streams!: Array<MediaStream>;
  @Input() set setStreams(streams: Array<MediaStream>) {
    this.streams = streams;
    this.reloadVideos()
  }
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('audioElement') audioElement!: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize() {
    setTimeout(() => {
      this.resizeVideo()
    }, 1);
  }
  streamHeight: number = 0;
  videoHeight: number = 0;
  videoWidth: number = 0;
  currentStream: MediaStream | undefined;
  constructor(private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2) {
    if(this.streams)
    this.currentStream = this.streams[0];
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resizeVideo()
    }, 1);
  }
  reloadVideos(){
    console.log("TRYLOG")
    console.log(this.streams)
    if(this.streams){
      this.currentStream = this.streams[0];
      setTimeout(() => {
        this.videoElement.nativeElement.play()
      }, 200);
      
      //console.log("curreent id = ", this.streams[0]["id"])
    }

  }
  // ngAfterViewChecked(): void {
  //   this.resizeVideo()
  //   //console.log(this.videoHeight)
  //   //console.log(this.videoWidth)
  // }

  resizeVideo(){
    this.renderer.setStyle(this.videoElement.nativeElement, "height", `${this.videoElement.nativeElement.offsetWidth/16*9}px`);
    this.streamHeight = this.videoElement.nativeElement.offsetWidth/16*9
    this.videoHeight = this.videoElement.nativeElement.offsetHeight;
    this.videoWidth = this.videoElement.nativeElement.offsetWidth;
    console.log("height of stream: ",this.streamHeight)
    this.changeDetectorRef.detectChanges();
    console.log(this.videoHeight)
    console.log(this.videoWidth)
    
  }

  nextSlide(){
    console.log("next");
  }
  previousSlide(){
    console.log("previous");
  }

  
}
