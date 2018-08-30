import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgForm, FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { CatalogueService } from './catalogue.service';
import { GlobalService } from '../../../shared/global.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material';
import { MerchantService } from '../../merchants.service';
import { Router } from '@angular/router';
import { ProductService } from './product.service';
import { element } from 'protractor';

declare var $: any;

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
mode = 0; // 0 admin, 1 merchant, 2 merchant through admin
  superCategoryForm: FormGroup;

hightlightStatus: Array<boolean> = [];
superCategoryName;
currentCategoryName;
showCategory = false;
showSubcategory = false;
collapsed = 0;
subCollapsed = 0;
childCollapsed = 0;
dummyProductImage = 'assets/images/upload.png';
instoreIcon = 'assets/images/ic_in_store.png';
productImage = [];
totalSuperCategory = 0;
totalProducts = 0;
superCategories = [];
currentSuperCategoryName;
currentSuperCategoryDesc;
editMode = false;
editCategory;
editParentCategory;
categoryEditAllowded = true;


Categories = [];

subCategories = [];

products = [];


selectedItem2;

modalRef: BsModalRef;
displayImage = 'assets/images/upload.png';
requestLoader = false;
userImage: File = null;
inventory = true;
templateTitle;
showSuperLoading = true;
selectedItem;
panelOpenState = false;


// product
productName;
productPrice;
productDesc;
productApproved = false;

// list super category
listSuperCategories = [];
listSuperCategoryOption = [];
listSuperCategoryChange = '';
visible: Boolean = true;
selectable: Boolean = true;
removable: Boolean = true;
addOnBlur: Boolean = true;

// Enter, comma
separatorKeysCodes = [ENTER, COMMA];

fruits = [];


// merchant when admin open its catalogue
currentMerchant ;
MerchantNameHeading = '';

showProductDetails = false;
// loaders
categoriesLoading = true;
productListLoading = true;
productDetailLoading = true;

NoProductToShow = false;
NoProductListToShow = false;
singleQuantity = true;

productQuantity = 0;
productInventory = [];
Heading = [];
tempAttributeArray = [];
InventoryTableEdit = [];
showViewMore = false;
merchantVerified = false;
merchantFreeListing = false;
DataPlan; // upgrading
planModalRef: BsModalRef;

ImagePath = '';
showSelectedProductDetail;

showProductCategory = {
  super: '',
  cat: '',
  sub: '',
  product: ''
};

postSubmit = false;
error = '';
attributeArray = [];

productInstore = false;
constructor(private modalService: BsModalService,
            private localStorageService: LocalStorageService,
            private catalogueService: CatalogueService,
            private globalService: GlobalService,
            public snackBar: MatSnackBar,
            private merchantService: MerchantService,
            private router: Router,
            private productService: ProductService,
            private merchantsService: MerchantService
          ) {}

ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.merchant_id !== undefined) {
      if (user.merchant_subscription === undefined ||
          user.merchant_display_name === ''
        ) {
              this.router.navigate(['/verify']);
          }
    const docs = JSON.parse(localStorage.getItem('doc'));

    if (docs === null && user.documents === undefined && user.merchant_verification_status === 'Not verified') {
      this.router.navigate(['/verify']);
    }

      if (user.merchant_verification_status === 'Not verified') {
        this.merchantVerified = false;
      } else {
        this.merchantVerified = true;
        if (user.merchant_subscription === 'FREELISTING') {
           this.merchantFreeListing = true;
        } else {
          this.merchantFreeListing = false;
        }

      }
      this.categoryEditAllowded = false;
      this.mode = 1;
    } else if (user.admin_id) {
      this.categoryEditAllowded = true;
      this.merchantVerified = true;
      this.merchantFreeListing = false;
      this.mode = 0;
    }
    // get merchant catalogue when admin is logged in
    if (this.router.url === '/merchants/merchant/catalogue') {
      this.categoryEditAllowded = true;
      this.mode = 2;

      this.currentMerchant = this.merchantService.getMerchant();
      // if (this.currentMerchant === undefined) {
      //   const merchantInfo = JSON.parse(localStorage.getItem('merchant-data'));
      //   if (merchantInfo !== '' || merchantInfo !== undefined) {
      //       if (merchantInfo.merchant_id !== undefined) {
      //         this.currentMerchant = merchantInfo;
      //       }
      //       // this.localStorageService.set('merchant-data', undefined);
      //   }
      // }
      console.log('current Mechant', this.currentMerchant);
      const merchant = JSON.parse(localStorage.getItem('merchant-data'));

      if (merchant !== null) {
        this.currentMerchant = merchant;
      }
      localStorage.removeItem('merchant-data');

      if (this.currentMerchant === undefined) {
        this.router.navigate(['/merchants']);
      } else {
        this.MerchantNameHeading = this.currentMerchant.merchant_display_name;
        this.catalogueService.getAllCategoriesMerchant(this.currentMerchant.merchant_id).subscribe(
          (response) => {
            if (response.success === 200) {
              this.showSuperLoading = false;
                this.categoriesLoading = false;
                this.superCategories = response.data;
                this.totalSuperCategory = this.superCategories.length;
                this.totalProducts = 0;

                if (this.superCategories.length > 0) {
                    // get Products

                    if ( this.superCategories[0].super_category_hasChild === 0) {
                      this.products = [];
                      this.showViewMore = false;
                      this.productListLoading = false;
                      this.productDetailLoading = false;
                      this.NoProductToShow = true;
                      this.NoProductListToShow = true;
                      this.snackBar.open('No Product Found', 'Dismiss', {
                        duration: 5000,
                      });
                   } else if (this.superCategories[0].category.length === 0 && this.superCategories[0].super_category_hasChild !== 2) {
                      this.products = [];
                      this.showViewMore = false;
                      this.productListLoading = false;
                      this.productDetailLoading = false;
                      this.NoProductToShow = true;
                      this.NoProductListToShow = true;
                      this.snackBar.open('No Product Found', 'Dismiss', {
                        duration: 5000,
                      });
                   } else if (this.superCategories[0].super_category_hasChild === 2) {
                        this.showProducts(this.superCategories[0]);
                   } else if (this.superCategories[0].category.length > 0 ) {
                      if (this.superCategories[0].category[0].category_hasChild === 0) {
                        this.products = [];
                        this.showViewMore = false;
                        this.productListLoading = false;
                        this.productDetailLoading = false;
                        this.NoProductToShow = true;
                        this.NoProductListToShow = true;
                        this.snackBar.open('No Product Found', 'Dismiss', {
                          duration: 5000,
                        });
                      } else if (this.superCategories[0].category[0].category_hasChild === 2) {
                        this.showProducts(this.superCategories[0].category[0]);
                      } else if (this.superCategories[0].category[0].category_hasChild === 1 &&
                                this.superCategories[0].category[0].Sub_Category.length === 0) {
                          this.products = [];
                          this.showViewMore = false;
                          this.productListLoading = false;
                          this.productDetailLoading = false;
                          this.NoProductToShow = true;
                          this.NoProductListToShow = true;
                          this.snackBar.open('No Product Found', 'Dismiss', {
                            duration: 5000,
                          });
                      } else {
                        this.showProducts(this.superCategories[0].category[0].Sub_Category[0]);
                      }
                  }
                  //  } else if (this.superCategories[0].category[0].category_hasChild === 0) {
                  //     this.products = [];
                  //     this.productListLoading = false;
                  //     this.productDetailLoading = false;
                  //     this.NoProductToShow = true;
                  //     this.NoProductListToShow = true;
                  //     this.snackBar.open('No Product Found', 'Dismiss', {
                  //       duration: 5000,
                  //     });
                  //  } else if (this.superCategories[0].category[0].category_hasChild === 2) {
                  //    this.showProducts(this.superCategories[0].category[0]);
                  //  } else {
                  //     this.showProducts(this.superCategories[0].category[0].Sub_Category[0]);
                  //  }
                } else {
                  this.totalProducts = 0;
                  this.productListLoading = false;
                  this.productDetailLoading = false;
                  this.NoProductToShow = true;
                  this.NoProductListToShow = true;

                }

            } else {
            // FAILURE CASE
            console.log(response);
              this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
                duration: 5000,
              });
            }
          },
          (error) => {
             console.log(error);
              this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
                duration: 5000,
              });
          }
        );
        // get catalogue data here
      }

    } else {

      localStorage.removeItem('merchant-data');
        this.catalogueService.getSuperCategory()
       .subscribe(
         (response) => {

          if (response.success === 200) {
            this.showSuperLoading = false;
            this.categoriesLoading = false;
            this.superCategories = response.data;
            this.totalSuperCategory = this.superCategories.length;
            if (user.merchant_id !== undefined) {
            this.MerchantNameHeading = user.merchant_display_name;
            }


            if (this.superCategories.length > 0) {

                // get Products
                  if ( this.superCategories[0].super_category_hasChild === 0) {
                      this.totalProducts = 0;
                      this.products = [];
                      this.showViewMore = false;
                      this.productListLoading = false;
                      this.productDetailLoading = false;
                      this.NoProductToShow = true;
                      this.NoProductListToShow = true;
                      this.snackBar.open('No Product Found', 'Dismiss', {
                        duration: 5000,
                      });
                  } else if (this.superCategories[0].category.length === 0 && this.superCategories[0].super_category_hasChild !== 2) {
                    this.totalProducts = 0;
                    this.products = [];
                    this.showViewMore = false;
                    this.productListLoading = false;
                    this.productDetailLoading = false;
                    this.NoProductToShow = true;
                    this.NoProductListToShow = true;
                    this.snackBar.open('No Product Found', 'Dismiss', {
                      duration: 5000,
                    });

                  } else if (this.superCategories[0].category.length > 0 ) {
                        if (this.superCategories[0].category[0].category_hasChild === 0) {
                          this.totalProducts = 0;
                          this.products = [];
                          this.showViewMore = false;
                          this.productListLoading = false;
                          this.productDetailLoading = false;
                          this.NoProductToShow = true;
                          this.NoProductListToShow = true;
                          this.snackBar.open('No Product Found', 'Dismiss', {
                            duration: 5000,
                          });
                        } else if (this.superCategories[0].category[0].category_hasChild === 2) {
                          this.showProducts(this.superCategories[0].category[0]);
                        } else if (this.superCategories[0].category[0].category_hasChild === 1 &&
                                  this.superCategories[0].category[0].Sub_Category.length === 0) {
                            this.products = [];
                            this.showViewMore = false;
                            this.totalProducts = 0;
                            this.productListLoading = false;
                            this.productDetailLoading = false;
                            this.NoProductToShow = true;
                            this.NoProductListToShow = true;
                            this.snackBar.open('No Product Found', 'Dismiss', {
                              duration: 5000,
                            });
                        } else {
                          this.showProducts(this.superCategories[0].category[0].Sub_Category[0]);
                        }

                  // } else if (this.superCategories[0].category[0].category_hasChild === 0) {
                  //   this.products = [];
                  //   this.productListLoading = false;
                  //   this.productDetailLoading = false;
                  //   this.NoProductToShow = true;
                  //   this.NoProductListToShow = true;
                  //   this.snackBar.open('No Product Found', 'Dismiss', {
                  //     duration: 5000,
                  //   });
                  } else if (this.superCategories[0].super_category_hasChild === 2) {
                    this.showProducts(this.superCategories[0]);
                  }
                  // } else if (this.superCategories[0].category[0].category_hasChild === 2) {
                  //   this.showProducts(this.superCategories[0].category[0]);
                  // } else {
                  //   this.showProducts(this.superCategories[0].category[0].Sub_Category[0]);
                  // }
              } else {
                this.totalProducts = 0;
                this.productListLoading = false;
                this.productDetailLoading = false;
                this.NoProductToShow = true;
                this.NoProductListToShow = true;
              }


          } else {
            // this.postSubmit = true;
           console.log(response.output.payload.message);
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
         },
         (error) => {
           console.log('error', error);
           this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
         }
       );

  }

  this.ImagePath = this.globalService.ImagePath;



}

onFileChange(file: FileList) {
  if (file.length === 0 ) {
    this.displayImage = 'assets/images/upload.png';
  } else {
    this.userImage = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.displayImage = event.target.result;
    };
     reader.readAsDataURL(this.userImage);
  }

}

openModal(template: TemplateRef<any>, superCategoryList: TemplateRef<any>) {
  this.requestLoader = false;
  this.displayImage = 'assets/images/upload.png';
  if (this.router.url === '/merchants/merchant/catalogue') {
    this.fruits = [];


    // use data when admin adding supercategories in merchant
    const data = this.currentMerchant.merchant_id;

    this.catalogueService.listSuperCategories(data).subscribe(
      (response) => {
        if (response.success === 200) {
          response.data.forEach(category => {
            if (category.already_selected === 0) {
              this.listSuperCategories.push(category);
            }
          });
          // this.listSuperCategories = response.data;
          this.modalRef = this.modalService.show(superCategoryList);

        } else {
          console.log(response);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  } else {
    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.admin_id !== undefined) {
      this.templateTitle = 'Add a Super Category';
      // super category
      this.currentSuperCategoryName = '';
      this.currentSuperCategoryDesc = '';

      this.modalRef = this.modalService.show(template);
    } else if (user.merchant_id !== undefined) {
      this.fruits = [];

      const data = {}; // use data when admin adding supercategories in merchant
      this.catalogueService.listSuperCategories(data).subscribe(
        (response) => {
          if (response.success === 200) {
            response.data.forEach(category => {
              if (category.already_selected === 0) {
                this.listSuperCategories.push(category);
              }
            });

            // this.listSuperCategories = response.data;
            this.modalRef = this.modalService.show(superCategoryList);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}

addCategoryModel(template: TemplateRef<any>, detail) {
  this.requestLoader = false;
  this.currentSuperCategoryName = '';
  this.currentSuperCategoryDesc = '';
  this.templateTitle = 'Add a Category';
  this.superCategoryName = detail;
  this.modalRef = this.modalService.show(template);
}

addSubCategoryModel(template: TemplateRef<any>, currentSuper, currentCategory) {
  this.requestLoader = false;
  this.currentSuperCategoryName = '';
  this.currentSuperCategoryDesc = '';
  this.templateTitle = 'Add a Sub Category';
  this.superCategoryName = currentSuper;
  this.currentCategoryName = currentCategory;
  this.modalRef = this.modalService.show(template);
}

openVerifyModal (template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}
addProduct(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}

upgradePlanModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}

planDetailModal(template: TemplateRef<any>) {
  this.planModalRef = this.modalService.show(template);
}

openInventoryModal(template: TemplateRef<any>) {
  this.Heading = [];
  this.InventoryTableEdit = [];
  this.tempAttributeArray = [];

  this.showSelectedProductDetail.pricing_array[0].product_spec.forEach(spec => {
    const obj = {
      product_spec_name : spec.ProductSpecType.product_spec_name,
      product_spec_id : spec.product_spec_id
    };


    this.Heading.push(obj);
  });

  this.Heading.sort(function(a, b) {
    return a.product_spec_id - b.product_spec_id;
  });

  this.showSelectedProductDetail.pricing_array[0].product_inventory.forEach(inventory => {

      const rowTable = {
        quantity: inventory.product_inventory,
        type : inventory.product_spec_values.split(',')

      };


      rowTable.type.forEach(val => {
        const data2 = val.split('_');
          const quantity = {
                id : JSON.parse(data2[0]),
                name : data2[1]
          };
          this.tempAttributeArray.push(quantity);
      });

      this.tempAttributeArray.sort(function(a, b) {
        return a.id - b.id;
      });

      const finalRow = {
          quantity : rowTable.quantity,
          type : this.tempAttributeArray
      };

      this.tempAttributeArray = [];
      this.InventoryTableEdit.push(finalRow);
  });

  // adding empty space for missing values
  this.InventoryTableEdit.forEach(row => {
        if (row.type.length < this.Heading.length) {
            this.Heading.forEach(attribute => {
                const index = row.type.findIndex(val => JSON.parse(val.id) === attribute.product_spec_id );
                if (index < 0) {
                  const obj = {
                    id : attribute.product_spec_id,
                    name : ''
                  };
                  row.type.push(obj);
                }
                row.type.sort(function(a, b) {
                  return a.id - b.id;
                });
            });
        }
  });

  this.modalRef = this.modalService.show(template);

}
addSuperCategory(form: NgForm) {
  this.requestLoader = true;
  const data = {
    form: form.value,
    image: this.userImage,
    merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
  };
  if (form.valid === false) {
      this.requestLoader = false;
      this.postSubmit = true;
      this.error = 'Mandatory Fields Missing!';
  } else {
    if (this.editMode === true) {
      const input = {
        categoryID : this.editCategory.super_category_id,
        form : data.form,
        image: data.image
      };



      this.catalogueService.editSuperCategory(input)
      .subscribe(
        (response) => {

          if (response.success === 200) {

            this.currentSuperCategoryName = '';
            this.currentSuperCategoryDesc = '';
            this.displayImage = 'assets/images/upload.png';
            this.requestLoader = false;
            form.reset();
            this.modalRef.hide();
            this.editMode = false;
            if (this.currentMerchant === undefined) {

              this.getData();
            } else {

                this.getMerchantData();
            }


         } else {
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
         }
        },
        (error) => {
          console.log('error', error);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
      );

    } else {
      this.catalogueService.addSuperCategory(data)
      .subscribe(
        (response) => {


         if (response.success === 200) {
            this.displayImage = 'assets/images/upload.png';
            this.requestLoader = false;
            this.modalRef.hide();
              if (this.currentMerchant === undefined) {
                this.getData();
              } else {
                this.getMerchantData();
            }
           const user = JSON.parse(localStorage.getItem('user-data'));
           if (user.merchant_id !== undefined) {
            this.snackBar.open('Super Category Requested To Admin Successfully', 'ok', {
              duration: 5000,
            });
           }

         } else {
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
         }
        },
        (error) => {
          console.log('error', error);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
      );
    }
  }


}


addProductForm(form: NgForm) {
  this.displayImage = 'assets/images/upload.png';
  const data = {
    form: form.value,
    image: this.userImage
  };

  // this.modalRef.hide();

  this.catalogueService.addProduct(data)
   .subscribe(
     (response) => {

       this.displayImage = 'assets/images/upload.png';
       this.modalRef.hide();
      // if (response.success === 200) {
      //   this.postSubmit = false;
      //   this.router.navigate(['/']);
      //   form.reset();
      //   this.displayImage = 'assets/images/profile-pic.png';
      // } else {
      //   this.postSubmit = true;
      //   this.error = response.output.payload.message;
      // }
     },
     (error) => {
       console.log('error', error);
       this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
        duration: 5000,
      });
     }
   );
}


addCategory(form: NgForm) {
  this.requestLoader = true;
  if (form.valid === false) {
    this.requestLoader = false;
    this.postSubmit = true;
    this.error = 'Mandatory Fields Missing!';
  } else {
    if (this.editMode === true) {

      const data = {
        form: form.value,
        image: this.userImage,
        superID: this.editParentCategory.super_category_id,
        categoryID : this.editCategory.category_id,
        merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };



      this.catalogueService.editCategory(data)
     .subscribe(
       (response) => {


        if (response.success === 200) {
          this.displayImage = 'assets/images/upload.png';
          this.editMode = false;
          this.requestLoader = false;
          form.reset();
          this.modalRef.hide();
          this.getData();
        } else {
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
       },
       (error) => {
          console.log('error', error);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
       }
     );

    } else {

      const data = {
        form: form.value,
        image: this.userImage,
        superID: this.superCategoryName.super_category_id,
        merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };
      this.catalogueService.addCategory(data)
     .subscribe(
       (response) => {

         this.displayImage = 'assets/images/upload.png';
         this.requestLoader = false;
         this.modalRef.hide();
        if (response.success === 200) {
          const user = JSON.parse(localStorage.getItem('user-data'));
           if (user.merchant_id !== undefined) {
            this.snackBar.open('Category Requested To Admin Successfully', 'ok', {
              duration: 5000,
            });
           } else {
            if (this.currentMerchant === undefined) {
              this.getData();
            } else {
                this.getMerchantData();
            }

           }
        } else {
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
       },
       (error) => {
         console.log('error', error);
         this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
         });
       }
     );
    }
  }


}

addSubCategory(form: NgForm) {
  this.requestLoader = true;

  if (form.valid === false) {
    this.requestLoader = false;
    this.postSubmit = true;
    this.error = 'Mandatory Fields Missing!';
  } else {
    if (this.editMode === true) {
      const data = {
        form: form.value,
        image: this.userImage,
        superID: this.editParentCategory.category_id,
        categoryID : this.editCategory.sub_category_id,
        merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };


      this.catalogueService.editSubCategory(data)
       .subscribe(
         (response) => {

           this.editMode = false;

          if (response.success === 200) {
            this.displayImage = 'assets/images/upload.png';
           form.reset();
           this.requestLoader = false;
           this.modalRef.hide();
           this.getData();
          } else {
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
         },
         (error) => {
           console.log('error', error);
           this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
         }
       );
    } else {

      const data = {
        form: form.value,
        image: this.userImage,
        catID: this.currentCategoryName.category_id,
        merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };
      this.catalogueService.addSubCategory(data)
       .subscribe(
         (response) => {

           this.displayImage = 'assets/images/upload.png';
           this.requestLoader = false;
           this.modalRef.hide();
          if (response.success === 200) {
          const user = JSON.parse(localStorage.getItem('user-data'));
           if (user.merchant_id !== undefined) {
            this.snackBar.open('Sub-Category Requested To Admin Successfully', 'ok', {
              duration: 5000,
            });
           } else {
            if (this.currentMerchant === undefined) {
              this.getData();
            } else {
              this.getMerchantData();
            }

           }
          } else {
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
         },
         (error) => {
           console.log('error', error);
           this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
         }
       );

    }
  }


}

// show category list
showCategories() {

  this.showCategory = true;
  this.showSubcategory = false;
}

  superCategorySelected(name: string) {
  this.showSubcategory = false;
  }


  selectCategory(category: string) {
    this.showSubcategory = !this.showSubcategory;
    this.selectedItem = category;

  }



  headerClicked(i) {
    // const newProduct = JSON.parse(localStorage.getItem('Product'));
    // if (newProduct !== null) {
    //     this.collapsed = newProduct.super;
    //     this.subCollapsed = newProduct.cat;
    // } else {
      this.productInstore = false;
      if (this.collapsed === i) {
        this.collapsed = -1;
      } else {
        this.collapsed = i;
        this.subCollapsed = -1;
        this.childCollapsed = -1;
      }
    // }

  }

  subHeaderClicked(i) {
    this.productInstore = false;
    if (this.subCollapsed === i) {
      this.subCollapsed = -1;
    } else {
      this.subCollapsed = i;
      this.childCollapsed = -1;
    }
    // this.subCollapsed = i;
  }

  // refresh data
  getData() {
    this.catalogueService.getSuperCategory()
   .subscribe(
     (response) => {
      if (response.success === 200) {
        this.showSuperLoading = false;
        this.superCategories = response.data;
        this.totalSuperCategory = this.superCategories.length;
      } else {
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
     },
     (error) => {
       console.log('error', error);
       this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
        duration: 5000,
      });
     }
   );
  }




  // Edit Category
  editSuperCategory(superCategory: any, template: TemplateRef<any>) {

    this.templateTitle = 'Edit Super Category';
    // super category
    this.currentSuperCategoryName = superCategory.super_category_name;
    this.currentSuperCategoryDesc =  superCategory.super_category_description;
    // this.displayImage =
    if (superCategory.super_category_image !== '') {
      this.displayImage = 'https://s3.us-east-2.amazonaws.com/swift-spar-local/delivery_app/' + superCategory.super_category_image;
    } else {
      this.displayImage = 'assets/images/upload.png';
    }
    this.editMode = true;
    this.editCategory = superCategory;
    this.modalRef = this.modalService.show(template);
  }


  editCategoryDetail(category: any, template: TemplateRef<any>, superCategory: any) {

    this.templateTitle = 'Edit Category';
    // category
    this.currentSuperCategoryName = category.category_name;
    this.currentSuperCategoryDesc =  category.category_description;
    // tslint:disable-next-line:max-line-length
    if (category.category_image !== '') {
      this.displayImage = 'https://s3.us-east-2.amazonaws.com/swift-spar-local/delivery_app/' + category.category_image;
    } else {
      this.displayImage = 'assets/images/upload.png';
    }
    this.editMode = true;
    this.editCategory = category;
    this.editParentCategory = superCategory;
    this.modalRef = this.modalService.show(template);
  }

  editSubCategoryDetail(sub: any, template: TemplateRef<any>, category: any) {

    this.templateTitle = 'Edit Category';
    // category
    this.currentSuperCategoryName = sub.sub_category_name;
    this.currentSuperCategoryDesc =  sub.sub_category_description;
    // tslint:disable-next-line:max-line-length
    if (sub.sub_category_image !== '') {
      this.displayImage = 'https://s3.us-east-2.amazonaws.com/swift-spar-local/delivery_app/' + sub.sub_category_image;
    } else {
      this.displayImage = 'assets/images/upload.png';
    }
    this.editMode = true;
    this.editCategory = sub;
    this.editParentCategory = category;
    this.modalRef = this.modalService.show(template);
  }



  // get product
  showProducts(category) {
    this.Heading = [];
    this.tempAttributeArray = [];
    this.InventoryTableEdit = [];

    this.productImage = [];
    if (category.super_category_id !== undefined && category.super_category_hasChild === 0) {
      this.products = [];
      this.showViewMore = false;
      this.totalProducts = 0;
      this.productListLoading = false;
      this.productDetailLoading = false;
      this.NoProductToShow = true;
      this.NoProductListToShow = true;
      this.showProductDetails = false;
      this.snackBar.open('No Product Found', 'Dismiss', {
        duration: 5000,
      });
    } else if (category.super_category_id !== undefined && category.super_category_hasChild === 2) {

      const data = {
        ID : category.super_category_id,
        merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };
      this.getSuperCatProducts(data);

    } else if (category.category_id !== undefined && category.category_hasChild === 0) {

        this.products = [];
        this.showViewMore = false;
        this.totalProducts = 0;
        this.productListLoading = false;
        this.productDetailLoading = false;
        this.NoProductToShow = true;
        this.NoProductListToShow = true;
        this.showProductDetails = false;
        this.snackBar.open('No Product Found', 'Dismiss', {
          duration: 5000,
        });
    } else if (category.category_id !== undefined && category.category_hasChild === 2) {

      const data = {
        ID : category.category_id,
        merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };
      this.getCatProducts(data);
    } else if (category.sub_category_id !== undefined) {

      const data = {
        ID : category.sub_category_id,
        merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };

      this.getSubCatProducts(data);
    } else {
        this.products = [];
        this.showViewMore = false;
        this.totalProducts = 0;
        this.productListLoading = false;
        this.productDetailLoading = false;
        this.NoProductToShow = true;
        this.NoProductListToShow = true;
        this.showProductDetails = false;
        this.snackBar.open('No Product Found', 'Dismiss', {
          duration: 5000,
        });
    }
  }

  getSuperCatProducts(data) {
    // this.productImage = [];
    this.catalogueService.getSuperCategoryProduct(data)
    .subscribe(
      (response) => {
        if (response.success === 200) {
          this.productListLoading = false;
          if (data.last !== undefined) {
            this.products = [...this.products, ...response.data.rows];
            this.showViewMore = true;
            this.totalProducts = response.data.count;
            if (response.data.rows.length < 15) {
              this.showViewMore = false;
            }
          // } else if (data.last !== undefined) {
            // this.products = [...this.products, ...response.data];
            // remove viewmore
          } else {
            this.products = response.data.rows;

          if (response.data.rows.length > 0) {
              this.totalProducts = response.data.count;
              this.showSelectedProductDetail = response.data.rows[0];
              this.attributeArray = [];
              this.productListLoading = false;


              this.showProductCategory.super = this.superCategories[this.collapsed].super_category_name;
              this.showProductCategory.cat = (this.superCategories[this.collapsed].category.length > 0) ?
                            this.superCategories[this.collapsed].category[this.subCollapsed].category_name : '';
              this.showProductCategory.sub = (this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category.length > 0) ?
                            // tslint:disable-next-line:max-line-length
                            this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category[this.childCollapsed].sub_category_name : '';
              this.showProductCategory.product = (this.showSelectedProductDetail !== undefined) ?
                            this.showSelectedProductDetail.product_name : '';

              this.showSelectedProductDetail.pricing_array[0].product_spec.forEach(attribute => {
                    const obj = {
                        name : attribute.ProductSpecType.product_spec_name,
                        values : attribute.product_spec_value.split(',')
                    };

                    this.attributeArray.push(obj);
              });

              // const productOne = response.data.rows[0];
              // this.productName = productOne.product_name;
              // this.productDesc =  productOne.product_description;
              if (this.showSelectedProductDetail.product_image !== '') {
                const imageArray = JSON.parse(this.showSelectedProductDetail.product_image);
                this.productImage = imageArray; // this.globalService.ImagePath + imageArray[0];

              }
              if (this.showSelectedProductDetail.product_type === 'INSTORE') {
                  this.productInstore = true;
              } else {
                  this.productInstore = false;
              }

              // if (productOne.pricing_array[0].product_inventory.length > 0 &&
              //     productOne.pricing_array[0].product_spec.length > 0) {
              //     // this.productInventory.push
              //     this.singleQuantity = false;
              //     productOne.pricing_array[0].product_spec.forEach(spec => {
              //       console.log(spec);
              //       const obj = {
              //         product_spec_name : spec.ProductSpecType.product_spec_name,
              //         product_spec_type_values : spec.ProductSpecType.product_spec_type_values.split(','),
              //         product_spec_id : spec.product_spec_id
              //       };
              //       console.log(obj.product_spec_type_values, typeof obj.product_spec_type_values);
              //       this.Heading.push(obj);
              //     });

              //     if (this.Heading.length > this.tempAttributeArray.length) {
              //       this.Heading.forEach(attribute => {
              //           const indexOne = this.tempAttributeArray.findIndex(val => JSON.parse(val.id) === attribute.product_spec_id );

              //           if (indexOne < 0) {
              //             const obj = {
              //               id : JSON.stringify(attribute.product_spec_id),
              //               name : ''
              //             };
              //             this.tempAttributeArray.push(obj);
              //             // const indexTwo = this.Heading.findIndex
              //           }
              //       });
              //     }
              //     this.Heading.sort(function(a, b) {
              //       return a.product_spec_id - b.product_spec_id;
              //     });
              //     // if (this.EditProduct.pricing_array[0].product_inventory.length > 0) {}
              //     productOne.pricing_array[0].product_inventory.forEach(inventory => {

              //         const rowTable = {
              //           quantity: inventory.product_inventory,
              //           type : inventory.product_spec_values.split(',')

              //         };
              //         rowTable.type.forEach(val => {
              //           const data2 = val.split('_');
              //             const quantity = {
              //                   id : data2[0],
              //                   name : data2[1]
              //             };
              //             this.tempAttributeArray.push(quantity);
              //         });
              //         this.tempAttributeArray.sort(function(a, b) {
              //           return a.id - b.id;
              //         });
              //         const finalRow = {
              //             quantity : rowTable.quantity,
              //             type : this.tempAttributeArray
              //         };
              //         this.tempAttributeArray = [];
              //         this.InventoryTableEdit.push(finalRow);
              //     });


              // } else {
              //   this.singleQuantity = true;
              // }
              // this.productQuantity = productOne.pricing_array[0].pricing_product_stock;

              // product_authorized
              this.productApproved = (this.showSelectedProductDetail.product_authorized === 0) ? false : true;
              // this.productPrice = productOne.pricing_array[0].product_pricing_price;
              // removing product detail loader
              this.productDetailLoading = false;
              this.showProductDetails = true;
              if (response.data.rows.length < 15) {
                this.showViewMore = false;
              } else if (response.data.rows.length === 15) {
                this.showViewMore = true;
              }
          } else {
            this.showViewMore = false;
            this.totalProducts = 0;
            this.showProductDetails = false;
            this.productDetailLoading = false;
            this.NoProductToShow = true;
            this.NoProductListToShow = true;
            this.snackBar.open('No Product Found', 'Dismiss', {
              duration: 5000,
            });
          }
        }
        }
      },
      (error) => {
        console.log('error', error);
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }

  getCatProducts(data) {
    // this.productImage = [];
    this.catalogueService.getCategoryProduct(data)
    .subscribe(
      (response) => {

        if (response.success === 200) {
          this.productListLoading = false;
          if (data.last !== undefined) {
            this.products = [...this.products, ...response.data.rows];
            this.showViewMore = true;
            this.totalProducts = response.data.count;
            if (response.data.rows.length < 15) {
              this.showViewMore = false;
            }
          } else {
            this.products = response.data.rows;
            // if (response.data.length > 0) {

            // }
            if (response.data.rows.length > 0) {
              this.totalProducts = response.data.count;
              this.productListLoading = false;
              this.showSelectedProductDetail = response.data.rows[0];

              this.attributeArray = [];
              this.showProductCategory.super = this.superCategories[this.collapsed].super_category_name;
              this.showProductCategory.cat = (this.superCategories[this.collapsed].category.length > 0) ?
                           this.superCategories[this.collapsed].category[this.subCollapsed].category_name : '';
              this.showProductCategory.sub = (this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category.length > 0) ?
                            // tslint:disable-next-line:max-line-length
                            this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category[this.childCollapsed].sub_category_name : '';
              this.showProductCategory.product = (this.showSelectedProductDetail !== undefined) ?
                            this.showSelectedProductDetail.product_name : '';

              this.showSelectedProductDetail.pricing_array[0].product_spec.forEach(attribute => {
                    const obj = {
                        name : attribute.ProductSpecType.product_spec_name,
                        values : attribute.product_spec_value.split(',')
                    };

                    this.attributeArray.push(obj);
              });

                // const productOne = response.data.rows[0];
                // this.productName = productOne.product_name;
                // this.productDesc =  productOne.product_description;
                if (this.showSelectedProductDetail.product_image !== '') {
                  const imageArray = JSON.parse(this.showSelectedProductDetail.product_image);
                  this.productImage =  imageArray; // this.globalService.ImagePath + imageArray[0];

                }
                if (this.showSelectedProductDetail.product_type === 'INSTORE') {
                    this.productInstore = true;
                } else {
                    this.productInstore = false;
                }

                // this.productPrice = productOne.pricing_array[0].product_pricing_price;
                // removing product detail loader
                this.productApproved = (this.showSelectedProductDetail.product_authorized === 0) ? false : true;
                this.showProductDetails = true;
                this.productDetailLoading = false;
                if (response.data.rows.length < 15) {
                  this.showViewMore = false;
                } else if (response.data.rows.length === 15) {
                  this.showViewMore = true;
                }

            }  else {
              this.totalProducts = 0;
              this.showViewMore = false;
              this.productDetailLoading = false;
              this.NoProductToShow = true;
              this.NoProductListToShow = true;
              this.showProductDetails = false;
              this.snackBar.open('No Product Found', 'Dismiss', {
                duration: 5000,
              });
            }
          }


        } else {
          console.log(response);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
      },
      (error) => {
        console.log('error', error);
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }



  getSubCatProducts(data) {
    // this.productImage = [];
    this.catalogueService.getSubCategoryProduct(data)
    .subscribe(
      (response) => {

        if (response.success === 200) {
          this.productListLoading = false;
          this.NoProductToShow = false;
          this.NoProductListToShow = false;
          this.totalProducts = response.data.count;

          if (data.last !== undefined) {
            this.products = [...this.products, ...response.data.rows];
            this.totalProducts = response.data.count;
            this.showViewMore = true;
            if (response.data.rows.length < 15) {
              this.showViewMore = false;
            }
          // } else if (data.last !== undefined) {
            // this.products = [...this.products, ...response.data];
            // remove viewmore
          } else {
            this.products = response.data.rows;



          if (response.data.rows.length > 0) {
            this.productListLoading = false;
            this.totalProducts = response.data.count;
            this.showSelectedProductDetail = response.data.rows[0];


            this.attributeArray = [];



            this.showProductCategory.super = this.superCategories[this.collapsed].super_category_name;
            this.showProductCategory.cat = (this.superCategories[this.collapsed].category.length > 0) ?
                          this.superCategories[this.collapsed].category[this.subCollapsed].category_name : '';
            this.showProductCategory.sub = (this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category.length > 0) ?
                          // tslint:disable-next-line:max-line-length
                          this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category[this.childCollapsed].sub_category_name : '';
            this.showProductCategory.product = (this.showSelectedProductDetail !== undefined) ?
                          this.showSelectedProductDetail.product_name : '';

            this.showSelectedProductDetail.pricing_array[0].product_spec.forEach(attribute => {
                  const obj = {
                      name : attribute.ProductSpecType.product_spec_name,
                      values : attribute.product_spec_value.split(',')
                  };

                  this.attributeArray.push(obj);
            });

            // const productOne = response.data.rows[0];
            this.showProductDetails = true;
            // this.productName = productOne.product_name;
            // this.productDesc =  productOne.product_description;
            if (this.showSelectedProductDetail.product_image !== '') {
              const imageArray = JSON.parse(this.showSelectedProductDetail.product_image);
              this.productImage = imageArray; // this.globalService.ImagePath + imageArray[0];

            }
            if (this.showSelectedProductDetail.product_type === 'INSTORE') {
                this.productInstore = true;
            } else {
                this.productInstore = false;
            }
            //  this.productPrice = productOne.pricing_array[0].product_pricing_price;
            // removing product detail loader
            this.productDetailLoading = false;
            this.productApproved = (this.showSelectedProductDetail.product_authorized === 0) ? false : true;
            if (response.data.rows.length < 15) {
              this.showViewMore = false;
            } else if (response.data.rows.length === 15) {
              this.showViewMore = true;
            }

          }  else {
            this.showViewMore = false;
            this.productDetailLoading = false;
            this.showProductDetails = false;
            this.NoProductToShow = true;
            this.NoProductListToShow = true;
            this.snackBar.open('No Product Found', 'Dismiss', {
              duration: 5000,
            });
          }
          }


        }
      },
      (error) => {
        console.log('error', error);
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }


  // show product

  showProduct(product) {
    this.Heading = [];
    this.tempAttributeArray = [];
    this.InventoryTableEdit = [];
    // this.productImage = [];
    console.log(product);

    this.showSelectedProductDetail = product;
    this.productListLoading = false;
    this.attributeArray = [];
    this.showProductDetails = true;


    this.showProductCategory.super = this.superCategories[this.collapsed].super_category_name;
    this.showProductCategory.cat = (this.superCategories[this.collapsed].category.length > 0) ?
                  this.superCategories[this.collapsed].category[this.subCollapsed].category_name : '';
    this.showProductCategory.sub = (this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category.length > 0) ?
                  // tslint:disable-next-line:max-line-length
                  this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category[this.childCollapsed].sub_category_name : '';
    this.showProductCategory.product = (this.showSelectedProductDetail !== undefined) ?
                  this.showSelectedProductDetail.product_name : '';

    this.showSelectedProductDetail.pricing_array[0].product_spec.forEach(attribute => {
          const obj = {
              name : attribute.ProductSpecType.product_spec_name,
              values : attribute.product_spec_value.split(',')
          };

          this.attributeArray.push(obj);
    });

    // const productOne = product;
    // this.productName = productOne.product_name;
    // this.productDesc =  productOne.product_description;
    if (this.showSelectedProductDetail.product_image !== '') {
      const imageArray = JSON.parse(this.showSelectedProductDetail.product_image);
      this.productImage = imageArray; // this.globalService.ImagePath + imageArray[0];

    }
    if (this.showSelectedProductDetail.product_type === 'INSTORE') {
        this.productInstore = true;
    } else {
        this.productInstore = false;
    }
    this.productApproved = (this.showSelectedProductDetail.product_authorized === 0) ? false : true;
    // if (productOne.pricing_array[0].product_inventory.length > 0 &&
    //     productOne.pricing_array[0].product_spec.length > 0) {
    //     // this.productInventory.push
    //     this.singleQuantity = false;
    //     productOne.pricing_array[0].product_spec.forEach(spec => {
    //       console.log(spec);
    //       const obj = {
    //         product_spec_name : spec.ProductSpecType.product_spec_name,
    //         product_spec_type_values : spec.ProductSpecType.product_spec_type_values.split(','),
    //         product_spec_id : spec.product_spec_id
    //       };
    //       console.log(obj.product_spec_type_values, typeof obj.product_spec_type_values);
    //       this.Heading.push(obj);
    //     });


    //     this.Heading.sort(function(a, b) {
    //       return a.product_spec_id - b.product_spec_id;
    //     });
    //     // if (this.EditProduct.pricing_array[0].product_inventory.length > 0) {}
    //     productOne.pricing_array[0].product_inventory.forEach(inventory => {

    //         const rowTable = {
    //           quantity: inventory.product_inventory,
    //           type : inventory.product_spec_values.split(',')

    //         };
    //         rowTable.type.forEach(val => {
    //           const data2 = val.split('_');
    //             const quantity = {
    //                   id : data2[0],
    //                   name : data2[1]
    //             };
    //             this.tempAttributeArray.push(quantity);
    //         });
    //         if (this.Heading.length > this.tempAttributeArray.length) {
    //           this.Heading.forEach(attribute => {
    //               const indexOne = this.tempAttributeArray.findIndex(val => JSON.parse(val.id) === attribute.product_spec_id );

    //               if (indexOne < 0) {
    //                 const obj = {
    //                   id : JSON.stringify(attribute.product_spec_id),
    //                   name : ''
    //                 };
    //                 this.tempAttributeArray.push(obj);
    //                 // const indexTwo = this.Heading.findIndex
    //               }
    //           });
    //         }
    //         this.tempAttributeArray.sort(function(a, b) {
    //           return a.id - b.id;
    //         });
    //         const finalRow = {
    //             quantity : rowTable.quantity,
    //             type : this.tempAttributeArray
    //         };
    //         this.tempAttributeArray = [];
    //         this.InventoryTableEdit.push(finalRow);
    //     });
    // } else {
    // this.productImage = 'assets/images/upload.png';
    // }
    // this.productPrice = product.pricing_array[0].product_pricing_price;
  }



















  // listing supercategory for merchant

  onSuperCategoryChange(index) {
    if (index !== '') {
    console.log('index', index);
      const idx = this.fruits.findIndex(x => x.super_category_id === this.listSuperCategories[index].super_category_id);
      if (idx < 0) {
        this.fruits.push(this.listSuperCategories[index]);
      }
    }
  }


  openModalSecond(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = null;
    this.templateTitle = 'Add a Super Category';
    // super category
    this.currentSuperCategoryName = '';
    this.currentSuperCategoryDesc = '';

    this.modalRef = this.modalService.show(template);
  }

  selectSuperCategory(form: NgForm) {
      console.log(this.listSuperCategoryChange);
      // add http request here

      const data = [];
      this.fruits.forEach(fruit => {
        data.push(fruit.super_category_id);
      });

      const values = {
        merchantID : (this.router.url === '/merchants/merchant/catalogue') ?
                      this.currentMerchant.merchant_id : '',
        superCategories : data.toString()
      };

      this.catalogueService.addSelectedSuperCategories(values).subscribe(
        (response) => {
          console.log(response);
          if (response.success === 200 ) {
            this.modalRef.hide();
            this.modalRef = null;
            form.reset();
            this.fruits = [];
            this.getMerchantData();
          }
        },
        (error) => {
          console.log(error);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
        }
      );
  }



  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }


  getMerchantData() {
    const data = (this.router.url === '/merchants/merchant/catalogue') ?
                  this.currentMerchant.merchant_id : '';
    this.catalogueService.getAllCategoriesMerchant(data).subscribe(
      (response) => {
        console.log(response);
        if (response.success === 200) {
          this.showSuperLoading = false;
          this.superCategories = response.data;
          this.totalSuperCategory = this.superCategories.length;
        }
      }, (error) => {
        console.log(error);
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }





  // product edit or new Product
  productScreen(productInfo) {


    if (this.superCategories.length < 1) {
        this.snackBar.open('Please Choose or Add Categories, before adding products.', 'Dismiss', {
          duration: 5000,
        });
    } else {
        const user = JSON.parse(localStorage.getItem('user-data'));
        if (user.merchant_id !== undefined) {
          this.localStorageService.set('merchant-data', user);
        } else if (this.currentMerchant !== undefined) {
          this.localStorageService.set('merchant-data', this.currentMerchant);
        } else if (user.admin_id !== undefined) {
          this.localStorageService.set('merchant-data', productInfo.pricing_array[0].Merchant);
        }

        if (productInfo === undefined) {
          this.router.navigate(['/catalogue/product/new']);
        } else {
          this.productService.setProduct(productInfo);
          this.router.navigate(['/catalogue/product/edit']);
        }
    }
  }

  addProductRoute() {
    this.localStorageService.set('merchant-data', this.currentMerchant);
  }

  childHeaderClicked(index) {
    this.productInstore = false;
    this.childCollapsed = index;
  }
  viewmoreProducts() {
    const last = this.products[this.products.length - 1].product_id;


    if (this.childCollapsed > -1 && this.subCollapsed > -1 && this.collapsed > -1) {
      // product of subcategory
      const data = {
        ID : this.superCategories[this.collapsed].category[this.subCollapsed].Sub_Category[this.childCollapsed].sub_category_id,
        last : last,
        merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };

      this.getSubCatProducts(data);
    } else if (this.childCollapsed === -1 ) {
        // product of category
        const data = {
          ID : this.superCategories[this.collapsed].category[this.subCollapsed].category_id,
          last : last,
          merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
        };

        this.getCatProducts(data);
    } else if (this.childCollapsed === -1 && this.subCollapsed === -1) {
      // product of supercategory
      const data = {
        ID : this.superCategories[this.collapsed].super_category_id,
        last : last,
        merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
      };

      this.getSuperCatProducts(data);
    }
  }




  // once verified get single merchant
  clickOnceVerified () {
    this.merchantService.verifyMerchant().subscribe(
      (response) => {
          if (response.success === 200) {
              this.localStorageService.set('user-data', response.data);

              const user = JSON.parse(localStorage.getItem('user-data'));

              if (user.merchant_id !== undefined) {
                if (user.merchant_verification_status === 'Not verified') {
                  this.merchantVerified = false;
                } else {
                  this.merchantVerified = true;
                  if (user.merchant_subscription === 'FREELISTING') {
                      this.merchantFreeListing = true;
                  } else {
                     this.merchantFreeListing = false;
                  }
                }
                this.categoryEditAllowded = false;
                this.mode = 1;
              }
          } else {
            console.log(response.output.payload.message);
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
      }, (error) => {
        console.log(error);
        this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }

  // upgrade plan

  planSelected(option) {

    // if (option === 1) {
    //     this.DataPlan = 'FREELISTING';
    // } else
    if (option === 3) {
        this.DataPlan = 'ONLINE';
    } else if (option === 2) {
        this.DataPlan = 'INSTORE';
    } else if (option === 4) {
        this.DataPlan = 'ONLINE/INSTORE';
    }

    this.merchantsService.editMerchantPlans(this.DataPlan).subscribe(
      (response) => {
          if (response.success === 200 ) {

            this.clickOnceVerified();
            this.modalRef.hide();
          } else {
            console.log(response);
            this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
              duration: 5000,
            });
          }
      }, (error) => {
          console.log(error);
          this.snackBar.open('Something Went Wrong, try again', 'Dismiss', {
            duration: 5000,
          });
      }
    );
}

}
