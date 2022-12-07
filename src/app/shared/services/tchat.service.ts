import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { FileService } from './file.service';
import { finalize } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MsgTchat } from '../modeles/msgTchat';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../modeles/user';
import { Router } from '@angular/router';
import { AuthServiceS } from './auth.service';

@Injectable()
export class TchatService {
  socket: any;
  messages: MsgTchat[];
  messagesAdmin: MsgTchat[];
  username: string;
  idTchat: number;
  isAdmin: boolean;
  base64String: string = "";
  lastDay: any;
  lastMois: any;
  lastYear: any;
  ws: any;
  visiteurIdSession:string="";
  connectedUser: User;
  constructor(private fileService: FileService,private authServices:AuthServiceS, private sanitizer: DomSanitizer, private http: HttpClient,private router:Router) { }

  initTchatService (isAdmin,url:any/*,params:any*/,authService,receivedConnectedUser){
    this.connectedUser=receivedConnectedUser;
    //this.connectedUser.id= receivedConnectedUser.id;
    this.connectedUser=this.authServices.getUserConnected();
    ////console.log(this.connectedUser.id);
    ////console.log(receivedConnectedUser);
    
    if(this.connectedUser==null)
    {
      this.connectedUser = new User(0, "", "", "anonyme", "anonyme", "", "", "VISITEUR", "", "", "");
      this.connectedUser.id=0;
      this.connectedUser.prenom="Anonyme";
      this.connectedUser.nom="Visiteur";
      this.connectedUser.userType="VISITEUR";
    }
    //this.connectedUser.id=+this.connectedUser.id;
    //console.log(this.connectedUser.id);
    this.messages = [];
    this.messagesAdmin = [];
    //console.log(this.connectedUser);
    //console.log(this.connectedUser.id);
    this.username = /* (this.connectedUser.id==null ?  */this.connectedUser.nom/* : "anonyme") */;
    this.isAdmin = false;
    //console.log(url + this.username+"/"+isAdmin+"/"+this.connectedUser.id+"/"+this.connectedUser.userType);
    this.ws = new WebSocket( url + this.username+"/"+isAdmin+"/"+this.connectedUser.id+"/"+this.connectedUser.userType);
    //console.log(this.connectedUser);
    this.ws.onopen=function(e){
      //console.log( "chat.connected" );
      if(this.isAdmin==true)
      {
        //console.log( "chat.connected2" );
      }
    }

    /* this.ws.addEventListener( "open", function( evt ) {
      //console.log( "chat.connected" );
      if(this.isAdmin==true)
      {
        //console.log( "chat.connected2" );
      }
      ////console.log(evt);
    }); */
    /* this.ws.onmessage=function(e){
      let messages = e.data;
      //console.log( "Receive new message: " + messages );
      this.receiveMessages(messages)
      if(isAdmin==true)
        this.receiveMessagesAdmin(messages);
    }; */
    this.ws.addEventListener("message", function (evt) {
     /* this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/component/tchatSpace']);
    });*/
    document.getElementById("tchatComp").focus();
      try {
        if (evt.data[0] == "[" || evt.data[0] == "{") {
          let messa = <MsgTchat[]>JSON.parse(evt.data);
          //console.log(evt.data);
          //console.log(messa);
          //console.log("taille:" + messa.length);
          if (evt.data[0] == "{") {
            this.receiveMessage(messa);
          }
          else {
            this.receiveMessages(messa);
            //console.log("allmsg");
            //console.log(this.messages);

          }
        }
        else
        {
          //console.log("Text:" + evt.data);
          this.visiteurIdSession=evt.data.split(" ").slice(-1);
          this.connectedUser.id=+evt.data.split(" ").slice(-1);
          //this.connectedUser.nom=this.connectedUser.nom+this.connectedUser.id;
        }
      } catch (error) {
        //console.log(error)
      }


      ////console.log("username"+this.messa[1]);

      ////console.log("username"+messa[0].username);
      /* let myVar = ()=>{
        this.receiveMessages(messa);
        //console.log(this.messages);
        //console.log("username2"+this.messages[1].username);
      }
      myVar=myVar; */

      //txtHistory.value += message + "\n";
    }.bind(this));


  }
  sendMessage(message: any, sendTo, profilReceiver, fileName) {
    const messagePackage = sendTo + "|" + profilReceiver + "|" + fileName + "|" + message;
    if (this.isAdmin == true) {
      this.ws.send(messagePackage);
    }
    else {
      this.ws.send(messagePackage);
    }
    /* if(this.isAdmin == true)
    {
      this.socket.emit('chat.send_message', message,sendTo,fileName);
    }
    else
    {
      this.socket.emit('chat.send_message', message,this.username,fileName);
    } */
  }

  receiveMessage(message: any) {
    //console.log(message.filename + "+++" + message.fileName);
    if (message.filename != null && message.filename != undefined && message.filename != "undefined" && message.filename != "") {
      //console.log("voila on a un fichier à recevoir");
      this.fileService.displayLoader$.next(true);
      this.fileService.download(message.filename)
        .pipe(finalize(() => this.fileService.displayLoader$.next(false))).pipe()
        .subscribe(response => {/*this.downLoadFile(response,  "image/jpeg"),//console.log(response);this.mydata=response}*/
          //console.log(response);
          this.base64String = <string>response;
          var contentRype = this.base64String.toString().split(";")[0];
          //var contentRype = response.getEntity().getContentType();
          //console.log("Content Type = " + contentRype);
          this.base64String = this.base64String.toString().replace(contentRype + ";", "");
          //console.log("Ma chaine = " + this.base64String);
          const byteArray = new Uint8Array(atob(<string>this.base64String).split('').map(char => char.charCodeAt(0)));
          var blob = new Blob([byteArray], { type: contentRype });
          //stringurl = window.URL.createObjectURL(blob);
          //saveAs(blob,"monfichier.gif");
          //  let pwa = window.open(stringurl);
          //  if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          //      alert( 'Please disable your Pop-up blocker and try again.');
          //  }
          message.msgFile = blob; /*this.sanitizer.bypassSecurityTrustResourceUrl(stringurl);*/
          message.urlfile = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
          if (contentRype != "image/jpeg" && contentRype != "image/png") {
            message.urlfile = "assets/img/tchat/direction.png";
          }
          //console.log(message.urlfile);
          this.gestionDate(message);
          this.messages.push(message);
          this.messages=this.messages.sort((a,b)=> +a.idMsg - +b.idMsg);
        });
    } else {

      this.gestionDate(message);
      //console.log(message.showDate);
      this.messages.push(message);
      //console.log(this.connectedUser);
    }
  }

  receiveMessages(messages: any[]) {
    this.messagesAdmin.splice(0);
    messages.forEach((message: any) => {
      this.receiveMessage(message);
      //this.gestionDate(message);
    });
    //this.socket.off('chat.connected');
  }

  receiveMessagesAdmin(adminmessages) {
    this.messagesAdmin.splice(0);
    /* //console.log(this.messagesAdmin); */
    adminmessages.forEach((message: any) => {
      if (!this.messagesAdmin.find(ma => ma.idMsg === message.idMsq))
        this.messagesAdmin.push(message);
    });/* 
    //console.log(this.messagesAdmin);
    //console.log(adminmessages); */
  }
  gestionDate(message: MsgTchat) {
    if (message.dateEnvoi != null) {
      let date = message.dateEnvoi.toString();
      //console.log(date);
      //date=date.substring(0,19);
      //console.log(date);
      message.dateEnvoi = new Date(<number><unknown>date * 10 / 10);
      /*  //console.log(message.dateEnvoi);
       message.dateEnvoi = new Date(<number><unknown>message.dateEnvoi*1000000); */
      //console.log(message.dateEnvoi);
      if (message.dateEnvoi.getDay() != this.lastDay) {
        this.lastDay = message.dateEnvoi.getDay();
        this.lastMois = message.dateEnvoi.getMonth();
        this.lastYear = message.dateEnvoi.getFullYear();
        message.showDate = true;
        //console.log(message.dateEnvoi + "jour diff de last jour: " + message.dateEnvoi.getDay());
      }
      else if (message.dateEnvoi.getMonth() != this.lastMois) {
        this.lastDay = message.dateEnvoi.getDay();
        this.lastMois = message.dateEnvoi.getMonth();
        this.lastYear = message.dateEnvoi.getFullYear();
        message.showDate = true;
        //console.log("mois diff de last mois: " + message.dateEnvoi.getMonth());
      }
      else if (message.dateEnvoi.getFullYear() != this.lastYear) {
        this.lastDay = message.dateEnvoi.getDay();
        this.lastMois = message.dateEnvoi.getMonth();
        this.lastYear = message.dateEnvoi.getFullYear();
        message.showDate = true;
        //console.log("annee diff de last annee: " + message.dateEnvoi.getFullYear());
      }
      else {
        //console.log("Message's Date: " + message.dateEnvoi.getDay() + message.dateEnvoi.getMonth() + message.dateEnvoi.getFullYear());
        message.showDate = false;
        //console.log("ras");
      }
    }
  }
  editMessage(message): Observable<any> {
    return this.http.put(environment.API_ENDPOINT + 'admin/updateMsg', message);
  }
}