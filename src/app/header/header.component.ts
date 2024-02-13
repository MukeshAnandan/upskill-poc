import { Component, EventEmitter, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public searchTerm:string='';
  @Output() filterEvent = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value.trim().toLowerCase();
      this.filterEvent.emit(value);
    }
  }

  
}
