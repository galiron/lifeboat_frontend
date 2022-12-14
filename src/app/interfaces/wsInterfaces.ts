export interface WSMessage {
    interfaceType: string;
}

export interface WSMessageResponse extends WSMessage{
    success: boolean;
}

export interface WSJwtResponse extends WSMessageResponse{
    jwt: string;
}

export interface WSJwtMessage extends WSMessage{
    jwt: string;
}

export interface WSFeedDogRequest extends WSMessage{
}

export interface WSConnectionTerminated extends WSMessage{
}

export interface WSLockReleaseResponse extends WSMessageResponse{
}

export interface WSControlTransfer extends WSMessage{
    name: string;
    identifier: string;
}

export interface WSControlTransferResponse extends WSJwtResponse{
    identifier: string;
}

export interface WSThrottleRequest extends WSJwtMessage{
    instruction: Instruction
}

export interface WSSteeringRequest extends WSJwtMessage{
    instruction: Instruction
}

export interface Instruction {
    value: number
}

/* Careful, this function is dumb and only checks the interfaceName
   that gets send! Make sure to not use the wrong interfaceName for the
   belonging data on the backend !!! */
export function messageIsOfInterface(message: any, interfaceName: string){
    if(message){
        if(message.interfaceType == interfaceName){
            return true;
        }
    }
    return false;
}