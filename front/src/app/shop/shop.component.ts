import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../models/product';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;

  private dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();

  public products: Product[] = [
    // { id: 1, name: 'Product 1', description: 'description 1', brand: 'Michelin', price: 100, size: '235/35/19', img: 'https://cdn.tiresleader.com/static/img/tyre_small_nologo/954747.jpg' },
  ];
  public filteredProducts: Product[] = [];

  public length: number = 5;
  public pageSize: number = 8;
  public pageIndex: number = 0;

  public filterProductName: string = '';
  public filterRefund: string = '-';
  public filterPriceMin: number | undefined;
  public filterPriceMax: number | undefined;

  constructor(private dataService: DataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = this.products;
      this.filteredProducts = this.paginate(this.products, this.pageSize, this.pageIndex + 1);
      this.length = this.products.length;
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.data = this.products;
    this.dataSource.paginator = this.paginator;
  }

  handlePage(event: PageEvent): void {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.filteredProducts = this.paginate(this.products, this.pageSize, this.pageIndex + 1);
  }

  paginate(array: any[], page_size: number, page_number: number): any[] {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  addToCart(product: Product, qty: string): void {
    let quantity: number = parseInt(qty);

    if (!quantity || quantity <= 0) {
      this.snackBar.open('La quantité doit être positive', '', { duration: 2400, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
      return;
    }

    this.dataService.addProductToCart({ product, quantity });
    this.snackBar.open('Produit ajouté au panier', '', { duration: 1800, horizontalPosition: 'right', verticalPosition: 'top', panelClass: 'snack-bar-container' });
  }

  onChangeProductQuantity(event: any): void {
    if (!event || !event.target || !event.target.value) return;

    let qty: number = parseInt(event.target.value);

    if (qty < 1) {
      event.target.value = 1;
    } else if (qty > 10000) {
      event.target.value = 10000;
    }
  }

  onFilter(): void {
    if (!this.products || !this.products.length) return;

    // Reset filter
    this.filteredProducts = this.products;

    // Filter product name
    if (this.filterProductName) {
      // Filter by product name
      this.filteredProducts = this.filteredProducts.filter(product => product.name.toLowerCase().indexOf(this.filterProductName.toLowerCase()) !== -1);
    }

    // Filter refund
    if (this.filterRefund) {
      switch (this.filterRefund) {
        case 'all':
        default:
          break;

        case 'refund':
          this.filteredProducts = this.filteredProducts.filter(product => product.refund && product.refund > 0);
          break;

        case 'norefund':
          this.filteredProducts = this.filteredProducts.filter(product => !product.refund || product.refund <= 0);
          break;
      }
    }

    // Filter price min
    if (this.filterPriceMin) {
      this.filteredProducts = this.filteredProducts.filter(product => product.price >= this.filterPriceMin!);
    }

    // Filter price max
    if (this.filterPriceMax) {
      this.filteredProducts = this.filteredProducts.filter(product => product.price <= this.filterPriceMax!);
    }
  }

}

