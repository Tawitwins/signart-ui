import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { AuthServiceS } from '../../../services/auth.service';
import { TchatService } from '../../../services/tchat.service';
import { User } from '../../../modeles/user';



@Component({
  selector: 'rightClicMenuTchat-component',
  templateUrl: 'rightClicMenuTchat.component.html',
  //styleUrls: ['./right-click-menu.component.css']
})
export class RightClicMenuTchatComponent implements OnInit {

  @Input() x = 0;
  @Input() y = 0;
  @Input() message = null;
  @Output() ishiddenchild = new EventEmitter<boolean>();

  constructor(private authService:AuthServiceS,private tchatService:TchatService) { }

  ngOnInit() {
  }
  supprimer()
  {
    if(confirm("Voulez vous vraiment supprimer ce message:"+this.message.contenu))
    {
      //console.log("suppression du message"+ this.message);
      //console.log(this.message.contenu);
      let user = <User>this.authService.getUserConnected();
      if(user.id==this.message.idSender)
      {
        this.message.msgStateSender="DELETED";
        this.message.msgStateReceiver="DELETED";
        this.message.contenu="Ce message a été supprimé !!";
      }
      else
      {
        this.message.msgStateReceiver="DELETED";
      }
      this.tchatService.editMessage(this.message).subscribe(resp =>{
        //console.log(resp);
      });
    }

  }
  transferer()
  {
    //console.log("transfert du message"+ this.message);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.message.username+": \""+this.message.contenu+"\" ["+this.message.dateEnvoi+"]";
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  copier()
  {
    //console.log("copie du message"+ this.message);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.message.contenu;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  leaveChild()
  {
    this.ishiddenchild.next(true);
  }
}


// // my-menu.component.ts
// import { Component } from '@angular/core';

// import { MenuComponent, ContextMenuService, MenuPackage } from '@ctrl/ngx-rightclick';
// import { trigger, state, style, transition, animate } from '@angular/animations'; 
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// @Component({
//   // selector: 'simple-menu',
//   // // add your menu html
//   // template: `<a (click)="handleClick()">Download</a>`,
//   templateUrl: 'rightClicMenuTchat.component.html',
//   selector: 'rightClicMenuTchat-component',
//   //animations:[BrowserAnimationsModule]
// })
// export class RightClicMenuTchatComponent extends MenuComponent {
//   // this module does not have animations, set lazy false
//   lazy = false;

//   constructor(
//     public menuPackage: MenuPackage,
//     public contextMenuService: ContextMenuService,
//   ) {
//     super(menuPackage, contextMenuService);
//     // grab any required menu context passed via menuContext input
//     //console.log(menuPackage.context)
//   }

//   handleClick() {
//     // IMPORTANT! tell the menu to close, anything passed in here is given to (menuAction)
//     this.contextMenuService.closeAll();
//   }
// }