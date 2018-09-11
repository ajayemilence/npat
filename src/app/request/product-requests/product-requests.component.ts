import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';
import { ProductService } from '../../merchants/merchant/catalogue/product.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import { MatSnackBar } from '@angular/material';
import { GLobalErrorService } from '../../shared/global-error.service';

@Component({
  selector: 'app-product-requests',
  templateUrl: './product-requests.component.html',
  styleUrls: ['./product-requests.component.css']
})
export class ProductRequestsComponent implements OnInit {
merchant;
requestedProducts;
productImage = 'assets/images/upload.png';
showViewMore = false;
  constructor(private requestService: RequestService,
              private productService: ProductService,
              private router: Router,
              private localStorageService: LocalStorageService,
              public snackBar: MatSnackBar,
              private globalErrorService: GLobalErrorService
              ) { }

  ngOnInit() {
   localStorage.removeItem('request-merchant');
   this.merchant = this.requestService.getRequestMerchant();

   if (this.merchant === undefined) {
      this.router.navigate(['/requests']);
   } else {
    const data = {
      merchantID: this.merchant.merchant_id,
      lastId : '',
      reload : 0  // 1: viewmore 0: normal
    };
     this.getProducts(data);
   }

  }


  requestStatus(val , product) {
    const data = {
      category_type_id: product.product_id,
      category_type : 4,
      status: val
    };
    this.requestService.requestResponse(data).subscribe(
      (response) => {

        if (response.success === 200) {
          const message = (val === 0) ? 'Successfully rejected Request' : 'Successfully accepted Request';
          this.globalErrorService.showSnackBar(message);
          const data2 = {
            merchantID: this.merchant.merchant_id,
            lastId: '',
            reload : 0  // 1: viewmore 0: normal
          };
          this.getProducts(data2);
        } else {
          console.log(response);
          const message = (val === 0) ? 'Unsuccessful to reject Request' : 'Unsuccessful to accept Request';
          this.globalErrorService.showSnackBar(message);
        }
      },
      (error) => {
        console.log(error);
        this.globalErrorService.errorOccured(error);
      }
    );

  }

  ProductEdit(product) {
    this.productService.setProduct(product);
    this.router.navigate(['/catalogue/product/edit']);
    this.localStorageService.set('request-merchant', this.merchant);
  }


  getProducts(data: any) {
      this.requestService.getRequestedProducts(data).subscribe(
        (response) => {

           if (response.success === 200) {
                if (response.data.length < 15) {
                    this.showViewMore = false;
                } else if (response.data.length === 15) {
                  this.showViewMore = true;
                }
             if (data.reload === 1) {
               this.requestedProducts = [...this.requestedProducts, ...response.data];
             } else {
                this.requestedProducts = response.data;
             }
           } else {
             console.log(response.output);
             this.globalErrorService.errorOccured(response);
           }
        },
        (error) => {
          console.log(error);
          this.globalErrorService.errorOccured(error);
        }
      );
  }

  viewMore() {
    const index = this.requestedProducts.length - 1;
    const lastOne = this.requestedProducts[index];

      const data = {
        merchantID: this.merchant.merchant_id,
        lastId: lastOne.product_id,
        reload : 1  // 1: viewmore 0: normal
      };
      console.log(data);
      this.getProducts(data);
  }
}
