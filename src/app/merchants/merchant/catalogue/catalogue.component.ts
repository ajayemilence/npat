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
productImage = 'assets/images/logo.jpg';
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

subCategories = [
{id: 1, name: 'Pasta'}
];

products = [
{id: 1, name: 'Burger'}
];


selectedItem2;

modalRef: BsModalRef;
displayImage = 'assets/images/upload.png';
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

// list super category
listSuperCategories = [];
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


// loaders
categoriesLoading = true;
productListLoading = true;
productDetailLoading = true;

NoProductToShow = false;
NoProductListToShow = false;
constructor(private modalService: BsModalService,
            private localStorageService: LocalStorageService,
            private catalogueService: CatalogueService,
            private globalService: GlobalService,
            public snackBar: MatSnackBar,
            private merchantService: MerchantService,
            private router: Router,
            private productService: ProductService
          ) {}

ngOnInit() {

    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.merchant_id !== undefined) {
      this.categoryEditAllowded = false;
      this.mode = 1;
    } else if (user.admin_id) {
      this.categoryEditAllowded = true;
      this.mode = 0;
    }
    // get merchant catalogue when admin is logged in
    if (this.router.url === '/merchants/merchant/catalogue') {
      this.categoryEditAllowded = true;
      this.mode = 2;
      console.log(this.router.url, 'case 1');
      this.currentMerchant = this.merchantService.getMerchant();
      console.log('current Mechant', this.currentMerchant);
      const merchant = JSON.parse(localStorage.getItem('merchant-data'));
        // if (merchant !== null) {
        //     this.currentMerchant = merchant;
        //     this.localStorageService.set('merchant-data', '');
        // }

        // console.log('current Mechant', this.currentMerchant);

      if (this.currentMerchant === undefined) {
        this.router.navigate(['/merchants']);
      } else {
        this.MerchantNameHeading = this.currentMerchant.merchant_first_name;
        this.catalogueService.getAllCategoriesMerchant(this.currentMerchant.merchant_id).subscribe(
          (response) => {
            if (response.success === 200) {
              this.showSuperLoading = false;
                this.categoriesLoading = false;
                this.superCategories = response.data;
                this.totalSuperCategory = this.superCategories.length;
                this.totalProducts = 0;
                console.log('supercategories', this.superCategories);
                if (this.superCategories.length > 0) {
                    // get Products
                    if ( this.superCategories[0].super_category_hasChild === 0) {
                      this.products = [];
                      this.productListLoading = false;
                      this.productDetailLoading = false;
                      this.NoProductToShow = true;
                      this.NoProductListToShow = true;
                      this.snackBar.open('No Product Found', 'Dismiss', {
                        duration: 5000,
                      });
                   } else if (this.superCategories[0].super_category_hasChild === 2) {
                      this.showProducts(this.superCategories[0]);
                   } else if (this.superCategories[0].category[0].category_hasChild === 0) {
                      this.products = [];
                      this.productListLoading = false;
                      this.productDetailLoading = false;
                      this.NoProductToShow = true;
                      this.NoProductListToShow = true;
                      this.snackBar.open('No Product Found', 'Dismiss', {
                        duration: 5000,
                      });
                   } else if (this.superCategories[0].category[0].category_hasChild === 2) {
                     this.showProducts(this.superCategories[0].category[0]);
                   } else {
                      this.showProducts(this.superCategories[0].category[0].Sub_Category[0]);
                   }
                } else {
                  this.totalProducts = 0;
                  this.productListLoading = false;
                  this.productDetailLoading = false;
                  this.NoProductToShow = true;
                  this.NoProductListToShow = true;

                }

            } else {
            // FAILURE CASE
            }
          },
          (error) => {
             console.log(error);
          }
        );
        // get catalogue data here
      }

    } else {

        this.catalogueService.getSuperCategory()
       .subscribe(
         (response) => {
          // console.log(this.superCategories, 'response');
          if (response.success === 200) {
            this.showSuperLoading = false;
            this.categoriesLoading = false;
            this.superCategories = response.data;
            this.totalSuperCategory = this.superCategories.length;
            if (user.merchant_id !== undefined) {
            this.MerchantNameHeading = user.merchant_first_name;
            }

            console.log(this.superCategories.length);
            console.log(this.superCategories[0]);
            if (this.superCategories.length > 0) {
              this.totalProducts = 0;
                // get Products
                  if ( this.superCategories[0].super_category_hasChild === 0) {
                      this.products = [];
                      this.productListLoading = false;
                      this.productDetailLoading = false;
                      this.NoProductToShow = true;
                      this.NoProductListToShow = true;
                      this.snackBar.open('No Product Found', 'Dismiss', {
                        duration: 5000,
                      });
                  } else if (this.superCategories[0].category.length === 0) {
                    this.products = [];
                    this.productListLoading = false;
                    this.productDetailLoading = false;
                    this.NoProductToShow = true;
                    this.NoProductListToShow = true;
                    this.snackBar.open('No Product Found', 'Dismiss', {
                      duration: 5000,
                    });
                  } else if (this.superCategories[0].category[0].category_hasChild === 0) {
                    this.products = [];
                    this.productListLoading = false;
                    this.productDetailLoading = false;
                    this.NoProductToShow = true;
                    this.NoProductListToShow = true;
                    this.snackBar.open('No Product Found', 'Dismiss', {
                      duration: 5000,
                    });
                  } else if (this.superCategories[0].super_category_hasChild === 2) {
                    this.showProducts(this.superCategories[0]);
                  } else if (this.superCategories[0].category[0].category_hasChild === 2) {
                    this.showProducts(this.superCategories[0].category[0]);
                  } else {
                    this.showProducts(this.superCategories[0].category[0].Sub_Category[0]);
                  }
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
  this.displayImage = 'assets/images/upload.png';
  if (this.router.url === '/merchants/merchant/catalogue') {
    this.fruits = [];
    this.modalRef = this.modalService.show(superCategoryList);

    // use data when admin adding supercategories in merchant
    const data = this.currentMerchant.merchant_id;
    console.log('data', data);
    this.catalogueService.listSuperCategories(data).subscribe(
      (response) => {
        if (response.success === 200) {
          this.listSuperCategories = response.data;
          console.log(this.listSuperCategories);
        }
      },
      (error) => {
        console.log(error);
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
      this.modalRef = this.modalService.show(superCategoryList);
      const data = {}; // use data when admin adding supercategories in merchant
      this.catalogueService.listSuperCategories(data).subscribe(
        (response) => {
          if (response.success === 200) {
            this.listSuperCategories = response.data;
            console.log(this.listSuperCategories);
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
  this.currentSuperCategoryName = '';
  this.currentSuperCategoryDesc = '';
  this.templateTitle = 'Add a Category';
  this.superCategoryName = detail;
  this.modalRef = this.modalService.show(template);
}

addSubCategoryModel(template: TemplateRef<any>, currentSuper, currentCategory) {
  this.currentSuperCategoryName = '';
  this.currentSuperCategoryDesc = '';
  this.templateTitle = 'Add a Sub Category';
  this.superCategoryName = currentSuper;
  this.currentCategoryName = currentCategory;
  this.modalRef = this.modalService.show(template);
}


addProduct(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}



addSuperCategory(form: NgForm) {

  const data = {
    form: form.value,
    image: this.userImage,
    merchantID: (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
  };
  if (this.editMode === true) {
    const input = {
      categoryID : this.editCategory.super_category_id,
      form : data.form,
      image: data.image
    };


    console.log(this.editCategory, 'Edit super category');
    this.catalogueService.editSuperCategory(input)
    .subscribe(
      (response) => {
        console.log(response, 'response');
        if (response.success === 200) {
          this.currentSuperCategoryName = '';
          this.currentSuperCategoryDesc = '';
          this.displayImage = 'assets/images/upload.png';
          form.reset();
          this.modalRef.hide();
          console.log(this.currentMerchant, 'this.currentMerchant');
          if (this.currentMerchant === undefined) {
            console.log('in if part');
            this.getData();
          } else {
            console.log('in else part');
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
        console.log(response, 'response');


       if (response.success === 200) {
          this.displayImage = 'assets/images/upload.png';
          this.modalRef.hide();
          console.log(this.currentMerchant, 'this.currentMerchant');
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


addProductForm(form: NgForm) {
  this.displayImage = 'assets/images/upload.png';
  const data = {
    form: form.value,
    image: this.userImage
  };
  console.log(data);
  // this.modalRef.hide();

  this.catalogueService.addProduct(data)
   .subscribe(
     (response) => {
       console.log(response, 'response');
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

  if (this.editMode === true) {
    console.log('Edit Mode Enabled');
    const data = {
      form: form.value,
      image: this.userImage,
      superID: this.editParentCategory.super_category_id,
      categoryID : this.editCategory.category_id,
      merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
    };

    console.log('Edit Mode Enabled', data);

    this.catalogueService.editCategory(data)
   .subscribe(
     (response) => {
       console.log(response, 'response');

      if (response.success === 200) {
        this.displayImage = 'assets/images/upload.png';
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
    console.log('Edit Mode disabled');
    const data = {
      form: form.value,
      image: this.userImage,
      superID: this.superCategoryName.super_category_id,
      merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
    };
    this.catalogueService.addCategory(data)
   .subscribe(
     (response) => {
       console.log(response, 'response');
       this.displayImage = 'assets/images/upload.png';
       this.modalRef.hide();
      if (response.success === 200) {
        const user = JSON.parse(localStorage.getItem('user-data'));
         if (user.merchant_id !== undefined) {
          this.snackBar.open('Category Requested To Admin Successfully', 'ok', {
            duration: 5000,
          });
         } else {
          if (this.currentMerchant === undefined) {
            console.log('in if part');
            this.getData();
          } else {
            console.log('in else part');
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

addSubCategory(form: NgForm) {

  if (this.editMode === true) {
    console.log('edit mode enabled');
    const data = {
      form: form.value,
      image: this.userImage,
      superID: this.editParentCategory.category_id,
      categoryID : this.editCategory.sub_category_id,
      merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
    };
    console.log('edit mode enabled', data);

    this.catalogueService.editSubCategory(data)
     .subscribe(
       (response) => {
         console.log(response, 'response');

        if (response.success === 200) {
          this.displayImage = 'assets/images/upload.png';
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
    console.log('edit mode disabled');
    const data = {
      form: form.value,
      image: this.userImage,
      catID: this.currentCategoryName.category_id,
      merchantID : (this.currentMerchant === undefined) ? '' : this.currentMerchant.merchant_id
    };
    this.catalogueService.addSubCategory(data)
     .subscribe(
       (response) => {
         console.log(response, 'response');
         this.displayImage = 'assets/images/upload.png';
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

// show category list
showCategories() {
  console.log('show category');
  this.showCategory = true;
  this.showSubcategory = false;
}

  superCategorySelected(name: string) {
  this.showSubcategory = false;
    console.log(name, 'name');
  }


  selectCategory(category: string) {
    this.showSubcategory = !this.showSubcategory;
    this.selectedItem = category;
    console.log(category, 'category');
  }



  headerClicked(i) {
    if (this.collapsed === i) {
      this.collapsed = -1;
    } else {
      this.collapsed = i;
      this.subCollapsed = -1;
    }

    console.log('headerclicked', this.collapsed);
  }

  subHeaderClicked(i) {
    if (this.subCollapsed === i) {
      this.subCollapsed = -1;
    } else {
      this.subCollapsed = i;
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
    console.log(superCategory, 'selected Super Category');
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
    console.log(category.category_image, 'selected Super Category');
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
    console.log(category, 'selected Super Category', sub);
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
    console.log(category);
    this.productImage = 'assets/images/logo.jpg';
    if (category.super_category_id !== undefined && category.super_category_hasChild === 0) {
      this.products = [];
      this.totalProducts = 0;
      this.productListLoading = false;
      this.productDetailLoading = false;
      this.NoProductToShow = true;
      this.NoProductListToShow = true;
      this.snackBar.open('No Product Found', 'Dismiss', {
        duration: 5000,
      });
    } else if (category.super_category_id !== undefined && category.super_category_hasChild === 2) {
      console.log('show super');
      const data = {
        ID : category.super_category_id
      };
      this.getSuperCatProducts(data);

    } else if (category.category_id !== undefined && category.category_hasChild === 0) {
        console.log('show category');
        this.products = [];
        this.totalProducts = 0;
        this.productListLoading = false;
        this.productDetailLoading = false;
        this.NoProductToShow = true;
        this.NoProductListToShow = true;
        this.snackBar.open('No Product Found', 'Dismiss', {
          duration: 5000,
        });
    } else if (category.category_id !== undefined && category.category_hasChild === 2) {
      console.log('show category');
      const data = {
        ID : category.category_id
      };
      this.getCatProducts(data);
    } else if (category.sub_category_id !== undefined) {
      console.log('show sub category');
      const data = {
        ID : category.sub_category_id
      };

      this.getSubCatProducts(data);
    }
  }

  getSuperCatProducts(data) {
    this.productImage = 'assets/images/logo.jpg';
    this.catalogueService.getSuperCategoryProduct(data)
    .subscribe(
      (response) => {
        if (response.success === 200) {
          this.productListLoading = false;
          this.products = response.data;
          if (response.data.length > 0) {
            this.totalProducts = response.data.length;
            this.NoProductToShow = false;
            this.NoProductListToShow = false;
            const productOne = response.data[0];
            this.productName = productOne.product_name;
            this.productDesc =  productOne.product_description;
            if (productOne.product_image !== '') {
              const imageArray = JSON.parse(productOne.product_image);
              this.productImage = this.globalService.ImagePath + imageArray[0];
            }

            // removing product detail loader
            this.productDetailLoading = false;
          } else {
            this.totalProducts = 0;
            this.productDetailLoading = false;
            this.NoProductToShow = true;
            this.NoProductListToShow = true;
            this.snackBar.open('No Product Found', 'Dismiss', {
              duration: 5000,
            });
          }
          // this.productPrice = 1;
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
    this.productImage = 'assets/images/logo.jpg';
    this.catalogueService.getCategoryProduct(data)
    .subscribe(
      (response) => {
        if (response.success === 200) {
          this.productListLoading = false;
          this.products = response.data;
          if (response.data.length > 0) {
            this.totalProducts = response.data.length;
            this.NoProductToShow = false;
            this.NoProductListToShow = false;
            const productOne = response.data[0];
            this.productName = productOne.product_name;
            this.productDesc =  productOne.product_description;
            if (productOne.product_image !== '') {
              const imageArray = JSON.parse(productOne.product_image);
              this.productImage = this.globalService.ImagePath + imageArray[0];
              console.log(this.productImage);
            }
            // removing product detail loader
            this.productDetailLoading = false;
          }  else {
            this.totalProducts = 0;
            this.productDetailLoading = false;
            this.NoProductToShow = true;
            this.NoProductListToShow = true;
            this.snackBar.open('No Product Found', 'Dismiss', {
              duration: 5000,
            });
          }
          // const inventory =
          this.productPrice = 1;
          console.log (this.products);
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
    this.productImage = 'assets/images/logo.jpg';
    this.catalogueService.getSubCategoryProduct(data)
    .subscribe(
      (response) => {
        if (response.success === 200) {
          this.productListLoading = false;
          this.NoProductToShow = false;
          this.NoProductListToShow = false;
          this.products = response.data;
          this.totalProducts = response.data.length;
          if (response.data.length > 0) {
            const productOne = response.data[0];
            this.productName = productOne.product_name;
            this.productDesc =  productOne.product_description;
            if (productOne.product_image !== '') {
              const imageArray = JSON.parse(productOne.product_image);
              this.productImage = this.globalService.ImagePath + imageArray[0];
              console.log(this.productImage);
            }

            // removing product detail loader
            this.productDetailLoading = false;
          }  else {
            this.productDetailLoading = false;
            this.NoProductToShow = true;
            this.NoProductListToShow = true;
            this.snackBar.open('No Product Found', 'Dismiss', {
              duration: 5000,
            });
          }
          // const inventory =
          this.productPrice = 1;
          console.log (this.products);
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
    console.log(product, typeof product);
    this.productName = product.product_name;
    this.productDesc =  product.product_description;
    // const inventory =
    if (product.product_image !== '') {
      const imageArray = JSON.parse(product.product_image);
      this.productImage = this.globalService.ImagePath + imageArray[0];
      console.log(this.productImage);
    } else {
    this.productImage = 'assets/images/logo.jpg';
    }
    this.productPrice = 1;
  }



















  // listing supercategory for merchant

  onSuperCategoryChange(index) {
    const idx = this.fruits.findIndex(x => x.super_category_id === this.listSuperCategories[index].super_category_id);
    if (idx < 0) {
      this.fruits.push(this.listSuperCategories[index]);
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
    const user = JSON.parse(localStorage.getItem('user-data'));
    if (user.merchant_id !== undefined) {
      this.localStorageService.set('merchant-data', user);
    } else if (this.currentMerchant !== undefined) {
      this.localStorageService.set('merchant-data', this.currentMerchant);
    }
    console.log(productInfo, '---');
    if (productInfo === undefined) {
      this.router.navigate(['/catalogue/product/new']);
    } else {
      this.productService.setProduct(productInfo);
      this.router.navigate(['/catalogue/product/edit']);
    }
  }
}
