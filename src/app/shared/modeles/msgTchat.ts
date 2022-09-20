export class MsgTchat {
    idMsg?:number;
    idSender?:number;
    idReceiver?:number;
    username ?: string;
    contenu ?: string;
    profilSender ?: string;
    filename ?: string;
    urlFile?: string;
    msgFile?:Blob;
    msgStateSender?: string;
    msgStateReceiver?: string;
    dateEnvoi:Date;
    showDate: boolean;
    constructor(
    ){}
}