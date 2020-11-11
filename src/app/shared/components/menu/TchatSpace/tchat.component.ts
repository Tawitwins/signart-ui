import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { RightClicMenuTchatComponent } from './rightClicMenuTchat.component';

import { Route } from '@angular/compiler/src/core';
import { Router, NavigationEnd } from '@angular/router';
import { User } from '../../../modeles/user';
import { MsgTchat } from '../../../modeles/msgTchat';
import { TchatService } from '../../../services/tchat.service';
import { FileService } from '../../../services/file.service';
import { AuthServiceS } from '../../../services/auth.service';
import { saveAs } from 'file-saver';

@Component({
  templateUrl: 'tchat.component.html',
  selector: 'tchat-component',
  changeDetection: ChangeDetectionStrategy.Default
})
export class TchatComponent implements OnInit {
  menu = RightClicMenuTchatComponent;
  public isHidden: Boolean = true;
  xPosTabMenu: Number;
  yPosTabMenu: Number;
  selectedMsg: any;
  messages: MsgTchat[];
  message: any;
  //messagesToShow: any;
  tchat: TchatService;
  username: string;
  messagesAdmin: any[];
  isAdmin: boolean;
  selectedUsername: string;
  sendTo: String = "0";
  profilReceiver: String = "ADMIN";
  showEmojis: boolean;
  toggleMobileSidebar:boolean=false;
  public fileName: string = "";
  public displayLoader: Observable<boolean> = this.fileService.isLoading();
  public formGroup = this.fb.group({
    file: [null, Validators.required],
    message: ["", Validators.required]
  });
  SelectedRow: any;
  isFile: boolean = false;
  SelectedMessage: any;
  connectedUser: User;
  //mySubscription: any;
  constructor(tchat: TchatService, private fb: FormBuilder, private fileService: FileService, private authService: AuthServiceS,private router:Router) {
    //this.messagesToShow = [];
    this.tchat = tchat;
    this.isAdmin= false;
    this.connectedUser=this.authService.getUserConnected();
    if(this.connectedUser==null)
    {
      this.connectedUser = new User("0", "", "", "anonyme", "anonyme", "", "", "VISITEUR", "", "", "");
      this.connectedUser.id="0";
      this.connectedUser.prenom="Anonyme";
      this.connectedUser.nom="Visiteur";
      this.connectedUser.userType="VISITEUR"; 
    }
    //this.adminService.utilisateur=this.adminService.getUserConnected();
    // console.log(this.connectedUser.nom);
    let host =`${window.location.host}`;
    this.tchat.initTchatService(this.isAdmin,"ws://"+host+"/stream/SignArt/admin/Ws/",authService/*, { query: `username=${adminService.utilisateur.nom}&idTchat=${auth.idTchat}&isAdmin=${this.isAdmin}`}*/);    
    this.messages = this.tchat.messages;
    this.messagesAdmin = this.tchat.messagesAdmin;
    this.username = /* (!this.connectedUser ?  */this.connectedUser.nom/* : "anonyme") */;
    this.selectedUsername = this.username;
    this.showEmojis = false ;
    this.connectedUser=this.tchat.connectedUser;
    console.log(this);
    
  }

  ngOnInit() {
    /* this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
    console.log(this.mySubscription.loaded); */
  }
  
  /* ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  } */
  sendMessage() {
    /*if (this.messages.length > 0) {
      let sento = this.messages.find(msg => msg.idReceiver != +this.connectedUser.id && msg.idReceiver != null);
      if (sento != null)
        this.sendTo = sento.idReceiver.toString();
    }*/
    if (this.formGroup.get('file').value != null) {
      console.log("send PJ");
      this.fileService.displayLoader$.next(true);
      this.fileService.upload(this.fileName, this.formGroup.get('file').value).subscribe(res => {
        console.log(res);
        this.message = this.formGroup.controls['message'].value;
        if (this.isAdmin == true) {
          this.tchat.sendMessage(this.message, this.sendTo, this.profilReceiver, this.fileName);
          //this.tchat.sendMessage(this.message,this.selectedUsername,this.fileName);
        }
        else {
          this.tchat.sendMessage(this.message, this.sendTo, this.profilReceiver, this.fileName);
          //this.tchat.sendMessage(this.message,null,this.fileName);
        }

        this.message = null;
        this.fileName = "";
        this.formGroup.patchValue({ 'message': null });
        this.formGroup.patchValue({ 'file': null });
      });

    } else {
      this.message = this.formGroup.controls['message'].value;
      if (this.isAdmin == true) {
        this.tchat.sendMessage(this.message, this.sendTo, this.profilReceiver, this.fileName);
        //this.tchat.sendMessage(this.message,this.selectedUsername,this.fileName);
      }
      else {
        this.tchat.sendMessage(this.message, this.sendTo, this.profilReceiver, this.fileName);
        //this.tchat.sendMessage(this.message,null,this.fileName);
      }

      this.message = null;
      this.fileName = "";
      this.formGroup.patchValue({ 'message': null });
    }

  }
  public onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.fileName = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result
        });
      };
    }
  }
  removeSelectedFile() {
    this.fileName = "";
    this.formGroup.patchValue({
      file: null,
    });
  }

  /* logout()
  {
    this.auth.logout(this.username);
    this.messages=null;
  }
 */
  saveFile(blob, name) {
    saveAs(blob, name/*,"signArt.gif"*/);
  }
  selectedEmoji(event) {
    this.message = this.message + event.emoji.native;
    this.formGroup.patchValue({ 'message': this.formGroup.controls['message'].value + event.emoji.native });
    console.log(event);
    console.log(event.emoji.colons);
    console.log(event.emoji.native);
  }
  EmojVisibleFunction(yesOrNo) {
    event.stopPropagation();
    if (yesOrNo == 1)
      this.showEmojis = true;
    else if (yesOrNo == 0)
      this.showEmojis = false;
    else
      this.showEmojis = !this.showEmojis;
  }



  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.formGroup.patchValue({
              file: reader.result
            });
          };
          this.fileName = droppedFile.relativePath;
          console.log(this.formGroup.controls['file'].value);
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
    this.isFile = true;
  }

  public fileLeave(event) {
    console.log(event);
    this.isFile = false;
  }

  rightClick(event, message) {
    event.stopPropagation();
    this.xPosTabMenu = event.pageX;
    this.yPosTabMenu = event.pageY;
    this.isHidden = false;
    this.selectedMsg = message;
    console.log(message);
    return false;
  }

  closeRightClickMenu() {
    //console.log(event);
    this.isHidden = true;
    this.showEmojis = false;
  }
}
