export interface WSReply{
    success: boolean;
    interfaceType: string;
}

export interface WSJwtReply extends WSReply{
    jwt: string;
}

export interface WSFeedDogRequest extends WSReply{
}

export interface WSConnectionTerminated extends WSReply{
}

export interface WSSteeringRequest extends WSReply{
}

export interface WSThrottleRequest extends WSReply{
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