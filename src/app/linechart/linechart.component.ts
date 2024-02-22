import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PieController } from 'chart.js';

Chart.register(...registerables, PieController);

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnInit {
  lineChart: any;
  constructor() { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createLineChart();
  }

  createLineChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    const data = [65, 59, 80, 81, 56, 55, 40, 30, 45, 60, 70, 80];
    const months = ['January', 'February', 'March', 'April', 'May', 
    'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
