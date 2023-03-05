export interface WSMessage {
  interfaceType: string;
}

export interface WSLockRequest extends WSMessage {
  username: string,
  password: string;
}

export interface WSMessageResponse extends WSMessage {
  success: boolean;
}

export interface WSVigilanceFeedResponse extends WSMessageResponse {

}

export interface WSJwtResponse extends WSMessageResponse {
  jwt: string;
}

export interface WSJwtMessage extends WSMessage {
  jwt: string;
}

export interface WSFeedDogRequest extends WSMessage {
}

export interface WSConnectionTerminated extends WSMessage {
}

export interface WSLockReleaseResponse extends WSMessageResponse {
}

export interface WSControlAssignment extends WSJwtResponse {
  cameraData: CameraData [];
}

export interface CameraData {
  name: string;
  uuid: string;
}

export interface WSControlTransfer extends WSMessage {
  username: string;
  identifier: string;
}

export interface WSControlTransferResponse extends WSJwtResponse {
  identifier: string;
}

export interface WSThrottleRequest extends WSJwtMessage {
  instruction: Instruction
}

export interface WSSteeringRequest extends WSJwtMessage {
  instruction: Instruction
}

export interface Instruction {
  value: number
}

export interface WSRequestControlTransferToBackend extends WSMessage {
  username: string,
  password: string
}

export interface WSRequestControlTransferToClient extends WSMessage {
  identifier: string;
  username: string
}
