import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public products: Product[] = [];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.dataService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  addProduct(): void {
    this.router.navigate(['/admin/product', -1]);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/admin/product', product.id]);
  }

}
