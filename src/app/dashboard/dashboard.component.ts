import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { PieController } from 'chart.js';
import { ProductService } from '../service/product.service';

Chart.register(...registerables, PieController);

interface Order {
  id: string;
  customerId: string;
  productName: string;
  status: string;
  customerName: string;
  orderDate: string;
  price?: string;
  productImage: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'customerId', 
    'productName', 
    'orderDate', 
    'price', 
    'status', 
    'customerName'];
  products: Order[] = [];
  chart: any;
  lineChart: any;
  filteredProducts: any[] | undefined;

  constructor(private http: HttpClient, private productService: ProductService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchOrders();
    this.productService.search.subscribe((val:any)=>{
      this.applySearchFilter(val);
    })
  }

  fetchOrders(): void {
    this.productService.getOrders()
      .subscribe((orders: any) => {
        this.products = orders;
        this.productService.emitOrders(this.products);
      });
  }

  applySearchFilter(searchTerm: string): void {
    this.filteredProducts = this.products
      .filter(product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  toggleEdit(order: any) {
    order.editing = !order.editing;
  }

  updateStatus(order: any) {
    order.editing = false;
    this.updateDataSource(order);
  }

  updateDataSource(order: any) {
    this.productService.updateOrder(order).subscribe(() => {
      this.fetchOrders();
     });    
  }

  getStatusButtonStyle(status: string): { [key: string]: string } {
    switch (status) {
      case 'pending': return { 'font-weight': 'bold', 'color': '#EDD460', 'background': '#fbf2e1' };
      case 'paid': return { 'font-weight': 'bold', 'color': '#45D48C', 'background':  '#d8f1d8' };
      case 'shipped': return { 'font-weight': 'bold', 'color': '#42B5D4', 'background': '#d7d7f9' };
      case 'not paid': return { 'font-weight': 'bold', 'color': '#DC416B', 'background': '#FDDCE5' };
      default: return {'font-weight': 'bold', 'color': 'gray' };
    }
  }

}
