import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/orders';
  public search = new BehaviorSubject<string>("");


  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get(this.apiUrl);
  }

  addOrder(order: any) {
    return this.http.post(this.apiUrl, order);
  }

  updateOrder(order: any) {
    console.log("update orders", order);
    const url = `${this.apiUrl}/${order.id}`;
    return this.http.put(url, order);
  }

  deleteOrder(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
