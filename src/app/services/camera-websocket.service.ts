import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraWebsocketService {
  private wsUrl: string = "wss://seamantics.ahoyrtc.com/1f3ca3c3c6580a07fca62e18c2d6f325802b681a" // document.location.host
  videos$ = new Subject<any>();
  ws = new WebSocket(this.wsUrl, "rtc-api-protocol");
  

  constructor() { 
    var localDescription : any = null;
    var remoteDescription : any = null;
    var iceCandidates : any = [];
    var socket : any = this.ws;
  
    this.ws.onopen = function() {
      console.log("onopen!");
    }
    this.ws.onmessage = (message: any) => { // message is of type feedListResponse, streamReceiveResponse or sdpRequest
      console.log("getting message")
      try {
        var msg = JSON.parse(message.data);
        console.log(msg);
        if (msg.feedListResponse && msg.feedListResponse.feeds && (msg.feedListResponse.feeds.length > 0)) {
          var index: any = 0;
          let feed: any;
          //if (document.location.search.length > 10) {
            let key = "488fac14-b0d7-4d3d-9ca3-e0e1ad2e2ae7"//document.location.search.substring(1);
            msg.feedListResponse.feeds.forEach(function(f: any) {
              if (f.id === key) {
                feed = f;
              }
            });
          /* } else if (document.location.search.length > 1) {
            index = document.location.search.substring(1);
            feed = msg.feedListResponse.feeds[index];
          } */
          let feedId : string = feed.id;
          this.ws.send(JSON.stringify(
              {
                streamReceiveRequest: {
                  feedId: feedId,
                  audio: {
                    enabled: true
                  },
                  video: {
                    enabled: true,
                  },
                  uuid: "" + Date.now()
                }
              }
          ));
        } else if (msg.streamReceiveResponse && msg.streamReceiveResponse.success) {
        } else if (msg.sdpRequest) {
          var pc: any = new RTCPeerConnection(undefined);
          pc.onaddstream = (event: any) => {
            if (event.stream) {
              console.log("PROPAGATING STREAAAAM!")
              console.log(JSON.stringify(event))
              setTimeout(() => {
                console.log(JSON.stringify(event))
                this.videos$.next(event.stream);
              }, 900);
              //video.play();
            }
          };
          var sendingSocket = this.ws;
          pc.setRemoteDescription(
            new RTCSessionDescription({ type: "offer", sdp: msg.sdpRequest.sdp}),
            function setRemoteSuccess() {
              pc.createAnswer(
                function createAnswerSuccess(description: any) {
                  localDescription = description;
                  pc.setLocalDescription(
                    localDescription,
                    function setLocalSuccess() {
                      console.log("local ok");
                      var message = {
                        sdpResponse: {
                          sdp: localDescription.sdp,
                          candidates: iceCandidates,
                          uuid: msg.sdpRequest.uuid
                        }
                      };
                      sendingSocket.send(JSON.stringify(message));
                    },
                    function setLocalError(error: any) {
                      console.log(error);
                    }
                  );
                },
                function createAnswerError(error: any) {
                  console.log(error);
                }
              );
            },
            function setRemoteError(error: any) {
              console.log(error);
            }
          );
        }
      } catch (error) {
        console.log(error);
        console.log('"'+message.data+'"');
      }
    }
    setTimeout(() => {
      this.start()
    }, 1000);
  }


  start() {
    console.log('start');
    this.ws.send(JSON.stringify(
      {
        feedListRequest: {
          uuid: "" + Date.now()
        }
      }
    ));
  }
}
