import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EvenementSignart } from '../../../shared/modeles/evenement&CodeSignart';
import { EvenementSignartService } from '../../../shared/services/evenement-signart.service';

@Component({
  selector: 'app-blog-left-sidebar',
  templateUrl: './blog-left-sidebar.component.html',
  styleUrls: ['./blog-left-sidebar.component.scss']
})
export class BlogLeftSidebarComponent implements OnInit {
  codeEventSignart
  evenementSignarts: EvenementSignart[]=[];

  constructor(evenementService:EvenementSignartService,public sanitizer: DomSanitizer,private datePipe:DatePipe) { 
    evenementService.getAllEvenement().subscribe(resp=>{
      //console.log(resp);
      this.evenementSignarts = resp;
      this.evenementSignarts.forEach(ev=>{
        ev.stringDateCreation = this.datePipe.transform(this.parseDate(ev.dateCreation),'dd/MM/yyyy')
        ev.stringDateOfficielle = this.datePipe.transform(this.parseDate(ev.dateOfficielle),'dd/MM/yyyy')
      })
      //console.log(this.evenementSignarts);
      
      
    })
  }

  ngOnInit(): void {
  }
  private parseDate(date) {
    let parseDate;
    if(date!=null)
       parseDate= date.split('T')[0]; 
    return parseDate
  }
}
