import { Injectable, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent as HomeComponent } from './home/home.component';
import { HomeComponent as Home1Component } from './main/home/home.component';
import { HomeComponent as AdminHomeComponent } from './admin/home/home.component';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './main/account/account.component';
import { AuthGuard } from './guard/auth.guard';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from './admin/admin.component';
import { ShopComponent } from './shop/shop.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './main/checkout/checkout.component';
import { OrdersComponent } from './main/orders/orders.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductsComponent } from './admin/products/products.component';
import { ProductComponent } from './admin/product/product.component';
import { OrdersComponent as AdminOrdersComponent } from './admin/orders/orders.component';
import { NewsletterComponent } from './newsletter/newsletter.component';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const split = routerState.url.split('/');
    // Title is set from the last url element
    this.title.setTitle(`MadCoffee | ${split[split.length - 1]}`);
  }
}

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: Home1Component },
      { path: 'account', component: AccountComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'orders', component: OrdersComponent },
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'product/:ID', component: ProductComponent },
      { path: 'orders', component: AdminOrdersComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'newsletter', component: NewsletterComponent },
  { path: 'account', redirectTo: 'main/account' },

  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule],
  providers: [
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy }
  ]
})
export class AppRoutingModule { }
