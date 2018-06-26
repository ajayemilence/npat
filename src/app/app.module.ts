import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CollapseModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './shared/auth-guard.service';
import { GlobalService } from './shared/global.service';
import { LocalStorageService } from './shared/local-storage.service';
import { AuthService } from './auth/auth.service';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrdersComponent } from './orders/orders.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { MerchantEditComponent } from './merchants/merchant-edit/merchant-edit.component';
import { MerchantComponent } from './merchants/merchant/merchant.component';
import { CatalogueComponent } from './merchants/merchant/catalogue/catalogue.component';
import { MerchantService } from './merchants/merchants.service';
import { ProductComponent } from './merchants/merchant/catalogue/product/product.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    OrdersComponent,
    MerchantsComponent,
    MerchantEditComponent,
    MerchantComponent,
    CatalogueComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    AuthService,
    LocalStorageService,
    GlobalService,
    AuthGuard,
    MerchantService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
