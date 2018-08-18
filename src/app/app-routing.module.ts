import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './shared/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { OrdersComponent } from './orders/orders.component';
import { MerchantEditComponent } from './merchants/merchant-edit/merchant-edit.component';
import { MerchantComponent } from './merchants/merchant/merchant.component';
import { CatalogueComponent } from './merchants/merchant/catalogue/catalogue.component';
import { ProductComponent } from './merchants/merchant/catalogue/product/product.component';
import { ProductEditComponent } from './merchants/merchant/catalogue/product-edit/product-edit.component';
import { MerchantAuthComponent } from './merchant-auth/merchant-auth.component';
import { MerchantNewComponent } from './merchants/merchant-new/merchant-new.component';
import { RequestComponent } from './request/request.component';
import { MerchantCatelogueComponent } from './merchant-catelogue/merchant-catelogue.component';
import { ProductRequestsComponent } from './request/product-requests/product-requests.component';
import { VerificationComponent } from './verification/verification.component';
import { VerifyMerchantComponent } from './verify-merchant/verify-merchant.component';

const appRoutes: Routes = [
    { path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
        { path: 'orders', component: OrdersComponent},
        { path: 'merchants', component: MerchantsComponent},
        { path: 'merchants/new', component: MerchantNewComponent},
        { path: 'merchants/edit', component: MerchantEditComponent},
        { path: 'merchants/merchant/info', component: MerchantComponent},
        { path: 'merchants/merchant/catalogue', component: CatalogueComponent},
        // { path: 'merchants/merchant/catalogue/product', component: ProductComponent},
        { path: 'catalogue', component: CatalogueComponent},
        { path: 'catalogue/product/new', component: ProductEditComponent},
        { path: 'catalogue/product/edit', component: ProductEditComponent},
        { path: 'requests', component: RequestComponent},
        { path: 'requests/merchants', component: VerifyMerchantComponent},
        { path: 'requests/products', component: ProductRequestsComponent},
    ]
    },

    // Auth Routes
    { path: 'auth',
    // canActivate: [AuthGuard],
    component: AuthComponent,
    },
    { path: 'merchant/auth',
    component: MerchantAuthComponent,
    },
    { path: 'verify',
    component: VerificationComponent,
    },
    { path: '**', redirectTo: '/auth'} // wild card route
];
@NgModule({
   imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
   exports: [RouterModule]
})
export class AppRoutingModule {
}
