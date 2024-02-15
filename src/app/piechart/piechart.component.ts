import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PieController } from 'chart.js';
import { ProductService } from '../service/product.service';

Chart.register(...registerables, PieController);

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnInit {

  products: any[] = [];
  chart: any;

  constructor(private productService: ProductService) {
    Chart.register(...registerables);
   }

  ngOnInit(): void {
    this.productService.getOrdersEmitter().subscribe((products: any[]) => {
      this.products = products;
      this.createPieChart();
    });
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

}
