import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartProduct } from 'src/app/models/cart-product';
import { Order } from 'src/app/models/order';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public orders: Order[] = [];
  public orders$?: Observable<Order[]>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.orders$ = this.dataService.getOrders();
    this.orders$.subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  getTotalPrice(order: Order): number {
    let totalPrice: number = 0;

    if (order.products) {
      for (let product of order.products) {
        if (!product || !product.price) continue;
        totalPrice += DataService.getRefundPrice(product);
      }
    }

    return totalPrice;
  }

}
