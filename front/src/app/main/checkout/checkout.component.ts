import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/models/country';
import { countries, DataService } from 'src/app/services/data.service';
import { CreateOrderActions, CreateOrderData, loadScript, OnApproveActions, OnApproveData, OnCancelledActions, OrderResponseBody, PayPalNamespace, PurchaseItem } from "@paypal/paypal-js";
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('stepper') private stepper!: MatStepper;

  public countries: Country[] = [];

  public readonly totalPrice: number = this.getTotalPrice();

  public firstFormGroup: FormGroup = this.formBuilder.group({
    lastnameCtrl: ['', Validators.required],
    nameCtrl: ['', Validators.required],
    addressCtrl: ['', Validators.required],
    postalCodeCtrl: ['', Validators.required],
    cityCtrl: ['', Validators.required],
    countryCtrl: ['', Validators.required],
  });
  // public secondFormGroup: FormGroup = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private authService: AuthService) {
    if (this.dataService.getCart.length === 0) {
      // Redirect to home if cart is empty
      this.router.navigate(['/']);
      return;
    }
  }

  async ngOnInit(): Promise<void> {
    await loadScript({
      "client-id": "AaD_eArL3lImSsUm6EPqC1XPhS6TZ1wkNt7DEamO8lUUJw9xQ1gf-_qvW4iAeFu3VZsJR61-NN5Qo1AF",
      "currency": "EUR"
    })
      .then((paypal: PayPalNamespace | null) => {
        if (!paypal || !paypal.Buttons) {
          throw new Error("PayPal SDK not available");
        }

        paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal"
            },
            createOrder: (data: CreateOrderData, actions: CreateOrderActions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: this.totalPrice.toString(),
                    currency_code: "EUR",
                    breakdown: {
                      item_total: {
                        value: this.totalPrice.toString(),
                        currency_code: "EUR"
                      }
                    }
                  },
                  items: this.dataService.getCart.map(p => {
                    return {
                      name: p.product.name,
                      quantity: p.quantity.toString(),
                      unit_amount: {
                        currency_code: "EUR",
                        value: DataService.getRefundPrice(p.product).toString()
                      }
                    }
                  })
                }]
              });
            },
            onApprove: async (data: OnApproveData, actions: OnApproveActions) => {
              console.log("Transaction ID: " + data.paymentID);
              console.log("Payer ID: " + data.payerID);

              if (!actions) {
                throw new Error("No actions");
              }

              if (!actions.order) {
                throw new Error("No order");
              }

              const details: OrderResponseBody = await actions.order.capture();
              // alert("Transaction completed by " + details.payer.name.given_name);
              console.log(details);
              let order = await actions.order.get();
              console.log("Order ID: " + order.id);

              // Send order to backend
              // let paypalProducts: PurchaseItem[] | undefined = [];

              // if (order.purchase_units && order.purchase_units.length > 0) {
              //   paypalProducts = order.purchase_units[0].items;
              //.items.map(i => {
              //   return {
              //     product: i,
              //     quantity: parseInt(i.quantity)
              //   }
              // }).filter(p => p.quantity > 0)
              // }

              this.dataService.sendOrder({
                id: order.id,
                date: new Date()
                // products: paypalProducts
              });

              // Change the route to the success page
              this.stepper.next();
            },
            onCancel: (data: Record<string, unknown>, actions: OnCancelledActions) => {
              console.log("OnCancel", data, actions);
              // alert("Transaction cancelled");
            },
            onError: (err: any) => {
              console.error(err);
            }
          })
          .render('#paypal-button-container')
          .catch((err: any) => {
            console.error("Failed to render the PayPal Buttons", err);
          });
      })
      .catch((err: any) => {
        console.error("Failed to load the PayPal JS SDK script", err);
      });

    this.countries = countries;

    let user = this.authService.currentUserValue;

    if (user) {
      this.firstFormGroup.patchValue({
        nameCtrl: user.firstname,
        lastnameCtrl: user.lastname,
        addressCtrl: user.address,
        postalCodeCtrl: user.postalCode,
        cityCtrl: user.city,
      });

      if (user.country) {
        let country = this.countries.find(c => c.name === user!.country);

        this.firstFormGroup.patchValue({
          countryCtrl: country
        });
      } else {
        this.initDefaultCountry();
      }
    } else {
      this.initDefaultCountry();
    }
  }

  initDefaultCountry(): void {
    // Set default country to France
    let country = this.countries.find(c => c.code === 'FR');
    if (country) {
      this.firstFormGroup.patchValue({
        countryCtrl: country
      });
      // this.firstFormGroup.controls['countryCtrl'].setValue(country);
    }
  }

  home(): void {
    this.router.navigate(['/']);
  }

  getTotalPrice(): number {
    let productPrices: number[] = this.dataService.getCart.map(p => {
      return DataService.getRefundPrice(p.product) * p.quantity;
    });
    return productPrices.reduce((a, b) => a + b, 0);
  }

}
