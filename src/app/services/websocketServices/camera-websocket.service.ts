import { StreamStatus } from '../../models/streamStatus';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CameraData } from '../../interfaces/wsInterfaces';
import { Stream } from '../../models/stream';
import { ConfigService } from '../dataServices/config.service';

@Injectable({
  providedIn: 'root'
})
export class CameraWebsocketService {

  videos$ = new Subject<any>();
  ws: WebSocket //= new WebSocket(this.wsUrl, "rtc-api-protocol");
  callbackList : any = new Object;
  private streams: Array<Stream> = new Array<Stream>
  isReady$: Subject<boolean> = new Subject();
  

  requestStreams(cameraData: CameraData[]) {
    for (let camera of cameraData) {
      const tempuuid = camera.uuid + Date.now()
      if(!Stream.isContainedInArray(this.streams, camera.uuid)) {
        const streamstatus : StreamStatus = new StreamStatus(false, true);
        const stream = new Stream(camera.uuid, false, true, streamstatus);
        this.streams.push(stream);
        console.log("pushed stream: ", JSON.stringify(this.streams))
      }

      console.log("request stream uuid: ", JSON.stringify(camera.uuid))
      this.ws.send(JSON.stringify(
        {
          streamReceiveRequest: {
            feedId: camera.uuid,
            audio: {
              enabled: false
            },
            video: {
              enabled: true,
            },
            uuid: tempuuid
          }
        }
      ));
      this.callbackList[tempuuid] = (result: any) => {
        console.log("camera: ", camera);
        console.log("result: ", result);
      }
    }
  }

  constructor(private configService: ConfigService) { 
    configService.loadConfig()
    var iceCandidates : any = [];
    this.ws = new WebSocket(configService.config.wsUrl, "rtc-api-protocol");
  
    this.ws.onopen = () => {
      console.log("onopen!");
      this.isReady$.next(true)
    }
    this.ws.onmessage = (message: any) => { // message is of type feedListResponse, streamReceiveResponse or sdpRequest
      console.log("getting message")
      try {
        var msg = JSON.parse(message.data);
        console.log(msg);
        if (msg.streamReceiveResponse && msg.streamReceiveResponse.success) {
          if(this.callbackList[msg.streamReceiveResponse.uuid]) {
            this.callbackList[msg.streamReceiveResponse.uuid](msg.streamReceiveResponse);
          }

        } else if (msg.sdpRequest) {
          let key = msg.sdpRequest.feedUuid;
          let stream: Stream;
          const indexOfStream = this.streams.findIndex((entry) => {
            return entry.feedUuid == key
            console.log("entryid: ", entry.feedUuid)
            console.log("keyid: ", key)
          })
          console.log("found stream at position: ", indexOfStream)
            // for (let entry of this.streams) {
            //   if(entry.uuid == key){
            //     stream = entry;
            //     this.streams.findIndex
            //   } 
            // }
          //console.log("sdp request: ", msg.sdpRequest)
          var pc: any = new RTCPeerConnection(undefined);
          pc.onaddstream = (event: any) => {
            if (event.stream) {
                this.videos$.next(event.stream);
              //video.play();
            }
          };
          var sendingSocket = this.ws;
          pc.setRemoteDescription(
            new RTCSessionDescription({ type: "offer", sdp: msg.sdpRequest.sdp}),
            () => { // setRemoteSuccess
              pc.createAnswer(
                (description: any) => { // createAnswerSuccess
                  this.streams[indexOfStream].localDescription = description;
                  pc.setLocalDescription(
                    description,
                    () => { // setLocalSuccess
                      console.log("local ok");
                      var message = {
                        sdpResponse: {
                          sdp: description.sdp,
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
