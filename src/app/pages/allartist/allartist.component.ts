import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-allartist',
  templateUrl: './allartist.component.html',
  styleUrls: ['./allartist.component.scss']
})
export class AllartistComponent implements OnInit {

  public mobileSidebar: boolean = false;
  public loader: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }
  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }
}

