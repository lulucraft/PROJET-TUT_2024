import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MaterialModule } from './material/material.module';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarSettingsComponent } from './sidebar/sidebar-settings/sidebar-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarLeftComponent } from './sidebar/sidebar-left/sidebar-left.component';
import { HomeComponent } from './main/home/home.component';
import { AccountComponent } from './main/account/account.component';
import { TokenHttpInterceptorInterceptor } from './interceptor/token-http-interceptor.interceptor';
import { registerLocaleData } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NgChartsModule } from 'ng2-charts';
import { ShopComponent } from './shop/shop.component';
import localeFr from '@angular/common/locales/fr';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './main/checkout/checkout.component';
import { OrdersComponent } from './main/orders/orders.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductsComponent } from './admin/products/products.component';
import { ProductComponent } from './admin/product/product.component';
import { OrdersComponent as AdminOrdersComponent } from './admin/orders/orders.component';
import { NewsletterComponent } from './newsletter/newsletter.component';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SidebarSettingsComponent,
    SidebarLeftComponent,
    HomeComponent,
    AccountComponent,
    AdminComponent,
    ShopComponent,
    CartComponent,
    CheckoutComponent,
    OrdersComponent,
    RegisterComponent,
    ProductsComponent,
    ProductComponent,
    AdminOrdersComponent,
    NewsletterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MaterialModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

    NgChartsModule
  ],
  providers: [
    { provide: "API_BASE_URL", useValue: environment.apiRoot },
    { provide: HTTP_INTERCEPTORS, useClass: TokenHttpInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
