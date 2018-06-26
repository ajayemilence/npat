import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './shared/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { OrdersComponent } from './orders/orders.component';
import { MerchantEditComponent } from './merchants/merchant-edit/merchant-edit.component';
import { MerchantComponent } from './merchants/merchant/merchant.component';
import { CatalogueComponent } from './merchants/merchant/catalogue/catalogue.component';
import { ProductComponent } from './merchants/merchant/catalogue/product/product.component';


const appRoutes: Routes = [
    { path: '',
    // canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
        { path: 'orders', component: OrdersComponent},
        { path: 'merchants', component: MerchantsComponent},
        { path: 'merchants/new', component: MerchantEditComponent},
        { path: 'merchants/merchant/info', component: MerchantComponent},
        { path: 'merchants/merchant/catalogue', component: CatalogueComponent},
        { path: 'merchants/merchant/catalogue/product', component: ProductComponent}
    ]
    },

    // Auth Routes
    { path: 'auth',
    // canActivate: [AuthGuard],
    component: AuthComponent,
    children: [
        { path: 'login', component: LoginComponent},
        { path: 'register', component: RegisterComponent}
    ]
    },
    { path: '**', redirectTo: '/auth/login'} // wild card route
];
@NgModule({
   imports: [RouterModule.forRoot(appRoutes)],
   exports: [RouterModule]
})
export class AppRoutingModule {
}
