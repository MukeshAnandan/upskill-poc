import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { PieController } from 'chart.js';
import { ProductService } from '../service/product.service';

Chart.register(...registerables, PieController);

interface Order {
  id: number;
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
        console.log("fetch orders", orders);
        this.products = orders;
        this.createPieChart();
        this.createLineChart();
      });
  }

  applySearchFilter(searchTerm: string): void {
    this.filteredProducts = this.products
      .filter(product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    console.log("filtered products:", this.filteredProducts);
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'paid': 'green',
      'pending': 'orange',
      'shipped': 'blue'
    };
  
    return statusColors[status] || 'black';
  }

  createPieChart(): void {
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    const statusCounts: { [key: string]: number } = {};

    this.products.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const statusData = Object.values(statusCounts);
    const statusLabels = Object.keys(statusCounts);
    
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          label: 'Order Status',
          data: statusData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }],
        labels: statusLabels
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  createLineChart(): void {
    // Destroy existing chart if it exists
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    const data = [65, 59, 80, 81, 56, 55, 40, 30, 45, 60, 70, 80]; // Example data for each month
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Mock Data',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  toggleEdit(order: any) {
    order.editing = !order.editing;
  }

  updateStatus(order: any) {
    console.log("updated...!");
    order.style = this.getStatusButtonStyle(order.status);
    order.editing = false;
    console.log("order", order);
    this.updateDataSource(order);
  }

  updateDataSource(order: any) {
    this.productService.updateOrder(order).subscribe(() => {
      this.fetchOrders();
     });    
  }

  getStatusButtonStyle(status: string): { [key: string]: string } {
    switch (status) {
      case 'pending': return { 'color': 'orange' };
      case 'paid': return { 'color': 'green' };
      case 'shipped': return { 'color': 'blue' };
      default: return { 'color': 'gray' };
    }
  }


}
