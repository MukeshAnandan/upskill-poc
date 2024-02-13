import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  dashboardSubmenuVisible: boolean = false;
  pagesSubmenuVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDashboardSubmenu() {
    this.dashboardSubmenuVisible = !this.dashboardSubmenuVisible;
  }

  togglePagesSubmenu() {
    this.pagesSubmenuVisible = !this.pagesSubmenuVisible;
  }

}
