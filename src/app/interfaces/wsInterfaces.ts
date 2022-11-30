export interface WSReply{
    success: boolean;
    interfaceType: string;
}

export interface WSjwtReply extends WSReply{
    jwt: string;
}

export interface WSFeedDogRequest extends WSReply{
}

export interface WSconnectionTerminated extends WSReply{
}

export function messageIsOfInterface(message: any, interfaceName: string){
    if(message){
        if(message.interfaceType == interfaceName){
            return true;
        }
    }
    return false;
}