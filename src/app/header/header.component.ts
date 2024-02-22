import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../service/product.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public searchTerm:string='';
  @Output() filterEvent = new EventEmitter<string>();
  public searchInput:string = '';
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value.trim().toLowerCase();
      this.filterEvent.emit(value);
    }
  }

  search(event:any){
    this.searchTerm=(event.target as HTMLInputElement).value;
    this.productService.search.next(this.searchTerm);
  }

  searchText(searchTerm:string){
    this.productService.search.next(searchTerm);
  }

  
}
