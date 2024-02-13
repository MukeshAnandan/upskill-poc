import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

// Import the specific chart types you need
import { PieController } from 'chart.js';

// Register the chart types
Chart.register(...registerables, PieController);



interface Order {
  id: number;
  customerId: string;
  productName: string;
  status: string;
  customerName: string;
  orderDate: string;
  price?: string; // Optional property
  productImage: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['customerId', 'productName', 'orderDate', 'price', 'status', 'customerName'];
  products: Order[] = [];
  chart: any;

  constructor(private http: HttpClient) { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get('http://localhost:3000/orders')
      .subscribe((orders: any)  => {
         this.products = orders;
         this.createPieChart();
         this.createLineChart();
      });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'orange';
      case 'shipped':
        return 'blue';
      default:
        return 'black'; // Default color if status is not recognized
    }
  }

  createPieChart(): void {
    const statusCounts = {
      paid: 0,
      pending: 0,
      shipped: 0
    };

    this.products.forEach(order => {
      switch (order.status) {
        case 'paid':
          statusCounts.paid++;
          break;
        case 'pending':
          statusCounts.pending++;
          break;
        case 'shipped':
          statusCounts.shipped++;
          break;
        default:
          break;
      }
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
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'september', 'october', 'November', 'December'],
        datasets: [{
          label: 'Mock Data',
          data: [65, 59, 80, 81, 56, 55, 40],
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
    order.editing = !order.editing; // Toggle editing mode
  }

  updateStatus(order: any) {
    this.updateDataSource();
    order.style = this.getStatusButtonStyle(order.status);
    order.editing = false;
  }

  updateDataSource() {
  }

  getStatusButtonStyle(status: string) {
    let buttonStyle = {};
    switch (status) {
      case 'pending':
        buttonStyle = { 'color': 'orange' };
        break;
      case 'paid':
        buttonStyle = {  'color': 'green' };
        break;
      case 'shipped':
        buttonStyle = { 'color': 'blue' };
        break;
      default:
        buttonStyle = { 'color': 'gray' };
    }
    return buttonStyle;
  }

  
}
