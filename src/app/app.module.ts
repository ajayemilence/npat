import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CollapseModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule,
  MatCheckboxModule ,
  MatIconModule ,
  MatDatepickerModule ,
  MatFormFieldModule ,
  MatNativeDateModule ,
  MatInputModule,
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { AccordionModule } from 'ngx-bootstrap';
import { AngularFileUploaderModule } from 'angular-file-uploader';

import { AppComponent } from './app.component';
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
import { CatalogueService } from './merchants/merchant/catalogue/catalogue.service';
import { ProductEditComponent } from './merchants/merchant/catalogue/product-edit/product-edit.component';
import { MerchantAuthComponent } from './merchant-auth/merchant-auth.component';
import { MerchantAuthService } from './merchant-auth/merchant-auth.service';
import { MerchantNewComponent } from './merchants/merchant-new/merchant-new.component';
import { ProductService } from './merchants/merchant/catalogue/product.service';
import { RequestComponent } from './request/request.component';
import { RequestService } from './request/request.service';
import { MerchantCatelogueComponent } from './merchant-catelogue/merchant-catelogue.component';
import { MerchantCatelogueService } from './merchant-catelogue/merchant-catelogue.service';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    OrdersComponent,
    MerchantsComponent,
    MerchantEditComponent,
    MerchantComponent,
    CatalogueComponent,
    ProductComponent,
    ProductEditComponent,
    MerchantAuthComponent,
    MerchantNewComponent,
    RequestComponent,
    MerchantCatelogueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatChipsModule,
    MatCardModule,
    BrowserAnimationsModule,
    PaginationModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAV910NJZ9cwBSy-MvdDaVwVw1597icBmY',
      libraries: ['places']
    }),
    AngularFileUploaderModule, // for dropdown file upload
    MatTableModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  exports: [
    MatNativeDateModule ,
    MatDatepickerModule ,
    MatIconModule ,
    MatButtonModule ,
    MatFormFieldModule ,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
    ],
  providers: [
    AuthService,
    LocalStorageService,
    GlobalService,
    AuthGuard,
    MerchantService,
    CatalogueService,
    MerchantAuthService,
    ProductService,
    RequestService,
    MerchantCatelogueService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


