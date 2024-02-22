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
        labels: statusLabels,
        datasets: [{
          label: 'Order Status',
          data: statusData,
          backgroundColor: [
            '#42B5D4',
            '#45D48C',
            '#EDD460',
            '#DC416B'
          ],
          borderColor: [
            '#42B5D4',
            '#45D48C',
            '#EDD460',
            '#DC416B'
          ],
          borderWidth: 0
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.9,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
            }
          }
        }
      }
    });
  }

}
