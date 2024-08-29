import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public formGroup: FormGroup = this.formBuilder.group({
    nameCtrl: [null, Validators.required],
    descriptionCtrl: [null],
    brandCtrl: [null, Validators.required],
    sizeCtrl: [null, Validators.required],
    imageLinkCtrl: [null],
    imageFileCtrl: [null],
    priceCtrl: [null, Validators.required],
    refundCtrl: [null],
    quantityCtrl: [null, Validators.required]
  });

  public sizes: Category[] = [];

  public productId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.dataService.getSizes().subscribe(sizes => {
      this.sizes = sizes;
    });

    this.activatedRoute.params.subscribe(obj => {
      this.productId = obj['ID'];
      if (this.productId == -1) {
        // New product
      } else {
        // Edit product
        this.dataService.getProduct(this.productId).subscribe((product: Product) => {
          // Produit inexistant
          if (!product) {
            this.router.navigate(['/admin/products']);
            return;
          }

          this.formGroup.patchValue({
            nameCtrl: product.name,
            descriptionCtrl: product.description,
            brandCtrl: product.brand,
            sizeCtrl: product.category.id,
            imageLinkCtrl: product.imageLink,
            priceCtrl: product.price,
            refundCtrl: product.refund,
            quantityCtrl: product.stockQuantity,
          });
        });
      }
    });
  }

  back(): void {
    this.router.navigate(['/admin/products']);
  }

  async sendProduct(): Promise<void> {
    let name = this.formGroup.controls['nameCtrl'].value;
    let description = this.formGroup.controls['descriptionCtrl'].value;
    let brand = this.formGroup.controls['brandCtrl'].value;
    let sizeId = this.formGroup.controls['sizeCtrl'].value;
    let imageLink = this.formGroup.controls['imageLinkCtrl'].value;
    // let imageFile = this.formGroup.controls['imageFileCtrl'].value;
    let price = this.formGroup.controls['priceCtrl'].value;
    let refund = this.formGroup.controls['refundCtrl'].value;
    let quantity = this.formGroup.controls['quantityCtrl'].value;

    let category = this.sizes.find(s => s.id === sizeId);
    if (!category) {
      alert("Erreur lors de la récupération de la catégorie du produit");
      return;
    }

    if (this.productId == -1) {
      let productExists$: Observable<boolean> = this.dataService.productExists(name);
      let exists: boolean = await lastValueFrom(productExists$);
      if (exists) {
        this.snackBar.open('Le produit \'' + name + '\' existe déjà', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
        return;
      }
    }

    if (price <= 0) {
      this.snackBar.open('Le prix doit être supérieur à 1', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
      return;
    }

    let priceAfterRefund: number = price - (price * refund / 100);
    if (priceAfterRefund <= 0) {
      this.snackBar.open('Le prix après promo doit être supérieur à 1', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
      return;
    }

    this.dataService.sendProduct({
      id: -1,
      name: name,
      description: description,
      brand: brand,
      category: { id: category.id, label: category.label },
      price: price,
      stockQuantity: quantity,
      imageLink: imageLink,
      refund: refund,
    });

    this.router.navigate(['/admin/products']);
  }

  addSize(sizeLabel: string): void {
    // Remove spaces
    sizeLabel = sizeLabel.trim();

    if (sizeLabel.length === 0) {
      this.snackBar.open('Catégorie invalide', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
      return;
    }

    let category = this.sizes.find(s => s.label && s.label.trim() === sizeLabel);
    if (category) {
      // Category already exists
      this.formGroup.controls['sizeCtrl'].setValue(category.id);
      this.snackBar.open('Cette catégorie existe déjà', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['snack-bar-container', 'warn'] });
      return;
    }

    // Add new category
    let id: number = 0;
    if (this.sizes.length > 0) {
      category = this.sizes[this.sizes.length - 1];
      if (category.id) id = category.id;
    }
    category = { id: (id + 1), label: sizeLabel };
    this.sizes.push(category);
    this.formGroup.controls['sizeCtrl'].setValue(category.id);
  }

  deleteProduct(): void {
    this.dataService.deleteProduct(this.productId);
  }

}
