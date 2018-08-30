import { Component, OnInit, TemplateRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CatalogueService } from '../catalogue.service';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {MatChipInputEvent, MatTableDataSource, MatSnackBar} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { combineAll } from 'rxjs/operators';
import { ProductService } from '../product.service';

import { AngularFileUploaderComponent } from 'angular-file-uploader';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../shared/global.service';
import { LocalStorageService } from '../../../../shared/local-storage.service';
import { ThrowStmt } from '@angular/compiler';

declare var x;
declare var y;
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  isLoading =  false;
  submitFormStatus = false;
  // defaultGender = 'female';
superCategories = [];
categories = [];
subCategory = [];
selectedSuper;
selectedCategory;
selectedSub;
selectedOption: string;
productImages = [];
filesIndex = [];
modalRef: BsModalRef;

deleteImages = [];

row = [];
editAttributeStatus = false;
// default values
defaultSuper;
defaultCategory;
defaultSub;

// chips
visible: Boolean = true;
selectable: Boolean = true;
removable: Boolean = true;
addOnBlur: Boolean = true;
// Enter, comma
separatorKeysCodes = [ENTER, COMMA];
fruits = [];


// error
postSubmit = false;
error;
// ID
catID = 0;
superCatID = 0;

// table of attribute
table = [];
keyName = '';
attributeOptions = [];
valueOption = [];

addNewValue = '';

attributes = [];
quantityTable = [];
allAttributes = [];



tempAttribute =  [];
tempObject = {};
tempTable = [];
defaultquantity = '';
editQuantityStatus = false;
editQuantityIndex ;
quantityError = false;
quantityErrorMessage = 'Missing Quantity!!';



// index
superCategoryID = '';
categoryID = '';
subCategoryID = '';

EditProduct;
// product parameter
defaultProductTax = '';
defaultProductSku = '';
defaultProductName = '';
defaultProductDesc = '';
defaultProductMRP = '';
defaultProductSellingPrice = '';
defaultProductType = '';
defaultProductImages = '';
defaultAvailQuantity = '';
defaultProductAttributes = '';
defaultProductSuperCategory = '';
defaultProductCategory = '';
defaultProductSubCategory = '';

EditProductMode = false;

tempSuperID;
tempCatID;
tempCat;

ImageOne;
ImageTwo;
ImageThree;
ImageFour;
ImageFive;

ImagePath;
displayImage = 'assets/images/upload.png';
attributesArrayEdit = [];

newImages = [];

InventoryTableEdit = [];
Heading = [];
tempAttributeArray = [];
ShowQuantityTable = false;

EditQuantity = '';
EditKeys = [];
EditQuantityArray = [];
EditQuantityIndexValue ;

newAttributesAdded = [];
noMoreImages = false;

subscriptionStatus =  0;
userData;
productPricingID;

// checked attributes
newAttributes = [];
  constructor(private catalogueService: CatalogueService,
              private modalService: BsModalService,
              private productService: ProductService,
              private router: Router,
              public snackBar: MatSnackBar,
              private globalService: GlobalService,
              private localStorageService: LocalStorageService
            ) { }

  ngOnInit() {

    this.ImagePath = this.globalService.ImagePath;
    this.catalogueService.getSuperCategory()
   .subscribe(
     (response) => {
      if (response.success === 200) {

         // super categories
         response.data.forEach(superCat => {
            if (superCat.super_category_hasChild === 1) {
                if (superCat.category.length > 0) {
                  this.superCategories.push(superCat);
                }
            } else {
              this.superCategories.push(superCat);
            }
         });
        //  this.superCategories = response.data;
         this.defaultSuper = response.data[0].super_category_name;

         // categories
         this.categories = response.data[0].category;
         this.defaultCategory = response.data[0].category;

         // sub-categories
         if (this.categories.length > 0) {
           this.subCategory = this.categories[0].Sub_Category;
         }
         this.table = [];

        this.userData = JSON.parse(localStorage.getItem('merchant-data'));

        if (this.userData === null) {
          this.userData = JSON.parse(localStorage.getItem('request-merchant'));

        }

        const subscription = this.userData.merchant_subscription;
        if (subscription === 'ONLINE' || subscription === 'INSTORE') {
            this.subscriptionStatus = 0;
            this.defaultProductType = subscription.toLowerCase() ;
        } else {
          this.subscriptionStatus = 1;
          this.defaultProductType = '' ;
        }
        // if (this.router.url === '/catalogue/product/new' ) {


        // } else
         if (this.router.url === '/catalogue/product/edit' ) {
          // loadin data
          this.isLoading = true;
          this.EditProduct = this.productService.getProduct();
          console.log(this.EditProduct, '****');
          if (this.EditProduct === undefined) {

            const user = JSON.parse(localStorage.getItem('user-data'));
            if (user.admin_id !== undefined) {
              this.router.navigate(['/merchants/merchant/catalogue']);
            } else if (user.merchant_id !== undefined) {
              this.router.navigate(['/catalogue']);
            }
          } else {
            this.EditProductMode = true;

            this.defaultProductTax = this.EditProduct.product_tax;
            this.defaultProductSku = this.EditProduct.product_sku;
            this.defaultProductName = this.EditProduct.product_name;
            this.defaultProductDesc = this.EditProduct.product_description;

            this.defaultProductSellingPrice = (this.EditProduct.pricing_array === undefined) ?
                this.EditProduct.product_pricing_price : this.EditProduct.pricing_array[0].product_pricing_discount;


            this.defaultProductMRP = (this.EditProduct.pricing_array === undefined) ?
            this.EditProduct.product_pricing_price : this.EditProduct.pricing_array[0].product_pricing_price;


            if (this.subscriptionStatus === 1) {
                this.defaultProductType = (this.EditProduct.product_type !== undefined) ? this.EditProduct.product_type.toLowerCase() : '';
            }

            // this.attributesArrayEdit


            // Inventory table
            if (this.EditProduct.pricing_array !== undefined && this.EditProduct.pricing_array.length > 0) {
              if (this.EditProduct.pricing_array[0].product_spec.length > 0
                  && this.EditProduct.pricing_array[0].product_inventory) {
                    this.EditProduct.pricing_array[0].product_spec.forEach(spec => {
                      const obj = {
                        product_spec_name : spec.ProductSpecType.product_spec_name,
                        product_spec_type_values : spec.ProductSpecType.product_spec_type_values.split(','),
                        product_spec_id : spec.product_spec_id
                      };
                      this.Heading.push(obj);
                    });


                    this.Heading.sort(function(a, b) {
                      return a.product_spec_id - b.product_spec_id;
                    });

                    // if (this.EditProduct.pricing_array[0].product_inventory.length > 0) {}
                    this.EditProduct.pricing_array[0].product_inventory.forEach(inventory => {

                        const rowTable = {
                          quantity: inventory.product_inventory,
                          type : inventory.product_spec_values.split(',')

                        };
                        rowTable.type.forEach(val => {
                          const data = val.split('_');
                            const quantity = {
                                  id : data[0],
                                  name : data[1]
                            };
                            this.tempAttributeArray.push(quantity);
                        });
                        if (this.Heading.length > this.tempAttributeArray.length) {
                          this.Heading.forEach(attribute => {
                              const indexOne = this.tempAttributeArray.findIndex(val => JSON.parse(val.id) === attribute.product_spec_id );
                              if (indexOne < 0) {
                                const obj = {
                                  id : JSON.stringify(attribute.product_spec_id),
                                  name : ''
                                };
                                this.tempAttributeArray.push(obj);
                                // const indexTwo = this.Heading.findIndex
                              }
                          });
                        }

                        this.tempAttributeArray.sort(function(a, b) {
                          return a.id - b.id;
                        });

                        const finalRow = {
                            quantity : rowTable.quantity,
                            type : this.tempAttributeArray,
                            inventory_id : inventory.product_inventory_id
                        };

                        this.tempAttributeArray = [];
                        this.InventoryTableEdit.push(finalRow);
                    });
                    // InventoryTableEdit
                    this.table = [];
                    const specArray = this.EditProduct.pricing_array[0].product_spec;

                    specArray.forEach(row => {

                      const obj = {
                        id: row.product_spec_value_id,
                        name: row.ProductSpecType.product_spec_name,
                        values: row.product_spec_value.split(',')
                      };
                      this.table.push(obj);
                    });

              }

            }



            // Image part Edit
            if (this.EditProduct.product_image === '' || this.EditProduct.product_image === undefined) {
              this.ImageOne = this.displayImage;
              this.ImageTwo = this.displayImage;
              this.ImageThree = this.displayImage;
              this.ImageFour = this.displayImage;
              this.ImageFive = this.displayImage;
            } else {
              const EditProductImages = JSON.parse(this.EditProduct.product_image);
               this.ImageOne = (EditProductImages[0] !== undefined) ? this.ImagePath + EditProductImages[0] : this.displayImage;
               this.ImageTwo = (EditProductImages[1] !== undefined) ? this.ImagePath + EditProductImages[1] : this.displayImage;
               this.ImageThree = (EditProductImages[2] !== undefined) ? this.ImagePath + EditProductImages[2] : this.displayImage;
               this.ImageFour = (EditProductImages[3] !== undefined) ? this.ImagePath + EditProductImages[3] : this.displayImage;
               this.ImageFive = (EditProductImages[4] !== undefined) ? this.ImagePath + EditProductImages[4] : this.displayImage;

            }

            if (this.EditProduct.product_super_category !== '0') {

              // tslint:disable-next-line:max-line-length
              const index = this.superCategories.findIndex(category => JSON.parse(category.super_category_id) ===
                           JSON.parse(this.EditProduct.product_super_category));
              if (index > -1) {
                  this.defaultProductSuperCategory = JSON.stringify(index);
              }

            } else if (this.EditProduct.product_category !== '0') {
              this.superCategories.forEach(superCategory => {
                const index = superCategory.category.findIndex(category => JSON.parse(category.category_id) ===
                  JSON.parse(this.EditProduct.product_category));

                  if (index > -1) {
                      const indexSuper = this.superCategories.findIndex(category =>
                        JSON.parse(category.super_category_id) ===
                          JSON.parse(superCategory.super_category_id));
                      this.defaultProductSuperCategory = JSON.stringify(indexSuper);
                      this.categories = this.superCategories[indexSuper].category;
                      this.defaultProductCategory = JSON.stringify(index);
                  }
              });


            } else if (this.EditProduct.product_sub_category_id !== '0') {
               // product from sub category

              this.superCategories.forEach(superCategory => {
                  superCategory.category.forEach(singleCategory => {
                    const index = singleCategory.Sub_Category.findIndex(category => JSON.parse(category.sub_category_id) ===
                    JSON.parse(this.EditProduct.product_sub_category_id));
                    if (index > -1) {
                        this.defaultProductSubCategory = JSON.stringify(index);

                        const indexSuper = this.superCategories.findIndex(category => JSON.parse(category.super_category_id) ===
                           JSON.parse(superCategory.super_category_id));
                        this.defaultProductSuperCategory = JSON.stringify(indexSuper);

                        const indexCat = this.superCategories[indexSuper].category.findIndex(
                          category => JSON.parse(category.category_id) === JSON.parse(singleCategory.category_id));
                        this.categories = response.data[indexSuper].category;
                        this.defaultProductCategory = JSON.stringify(indexCat);
                        this.subCategory = this.categories[indexCat].Sub_Category;
                    }
                  });
              });

              // if (this.superCategories.length > 0) {
              //   for (x = 0; x < this.superCategories.length; x++) {
              //     if (this.superCategories[x].category.length > 0) {
              //         this.tempCat = this.superCategories[x].category;
              //         console.log(this.tempCat, 'tempCat');
              //         // this.superCategories
              //     }
              //   }
              // }
            }



            // if (this.EditProduct.product_super_category !== '0') {
            //   // product from super category
            //   console.log('super');
            //   const inviteIndex2 = this.superCategories.findIndex(category =>
            //     category.super_category_id === this.EditProduct.product_super_category );
            //   console.log(inviteIndex2, 'super');

            // } else if (this.EditProduct.product_category !== '0') {
            //    // product from category
            //    console.log('cat');
            //    this.superCategories.forEach(categories => {
            //       const inviteIndex2 = categories.findIndex(category =>
            //           category.category_id === this.EditProduct.product_category );
            //       console.log(inviteIndex2, 'cat');
            //    });
            // } else if (this.EditProduct.product_sub_category_id !== '0') {
            //    // product from sub category
            //    console.log('sub', this.EditProduct.product_sub_category_id);
            //    this.superCategories.forEach(supers => {
            //      console.log(supers.category.length, typeof supers);
            //      if (supers.category.length > 0 ) {
            //         supers.category.forEach (catgories => {
            //               // console.log(catgories.Sub_Category, 'subbbb');
            //               if (catgories.Sub_Category.length > 0) {

            //                 const inviteIndex2 = catgories.Sub_Category.findIndex(category => {
            //                   console.log(this.EditProduct.product_sub_category_id);
            //                   console.log(category.sub_category_id , '==');
            //                   return category.sub_category_id === this.EditProduct.product_sub_category_id; } );
            //                   console.log(inviteIndex2, 'subIndexFinal');
            //               }
            //             // console.log(subcatgories, '==');
            //          });
            //      }
            //    });
            // }
            this.defaultProductImages = this.EditProduct.product_tax;
            this.defaultProductAttributes = this.EditProduct.product_tax;
            this.defaultAvailQuantity = this.EditProduct.pricing_array[0].pricing_product_stock;
          }
          // data loaded successfully
          this.isLoading = false;

        }

      } else {
        console.log(response.output.payload.message);
        this.snackBar.open('Something went wrong please try again', 'Dismiss', {
          duration: 5000,
        });
      }
     },
     (error) => {
       console.log('error', error);
       this.snackBar.open('Something went wrong please try again', 'Dismiss', {
         duration: 5000,
       });
     }
   );
  }

  onSearchChange(searchValue: string ) {
    // if (this.selected)
    this.valueOption = [];
    // autocomplete
    const search = {
      searchValue: searchValue,
      sub: (this.selectedSub !== undefined) ? this.selectedSub.sub_category_id : '' ,
      cat: (this.selectedSub === undefined && this.selectedCategory !== undefined) ? this.selectedCategory.category_id : '' ,
      super: (this.selectedSub === undefined && this.selectedCategory === undefined) ? this.selectedSuper.category_id : ''
    };
    console.log(search);
     this.productService.getAttribute(search).subscribe(
     (response) => {

       if (response.success === 200) {
        this.attributeOptions = [...response.data];
       } else {
         console.log(response);
       }

     },
     (error) => {
       console.log(error);
     }
   );
  }

selectSuggestion(value) {

  this.keyName = value.product_spec_name;
  this.attributeOptions = [];
  const values = value.product_spec_type_values;
  const array = values.split(',');
  array.forEach(data => {
    const obj = {
      val : data,
      checked: true
    };
    this.valueOption.push(obj);
});
}

onChange(superCategoryIndex) {
    if (superCategoryIndex !== '') {
      this.selectedSuper = this.superCategories[superCategoryIndex];

      this.categories = this.selectedSuper.category;
      if (this.categories.length > 0) {
        this.subCategory = this.categories[0].Sub_Category;
      } else {
        this.subCategory = [];
      }
    }

}

onChangeCategory(categoryIndex) {
  if (categoryIndex !== '--Select--') {
  this.selectedCategory = this.categories[categoryIndex];
  this.subCategory = this.categories[categoryIndex].Sub_Category;
  }
}

// Register
onFileChange(file: FileList) {

  this.filesIndex = _.range(file.length);
    _.each(this.filesIndex, (idx) => {
      if (idx < 5) {
        // for editing
        this.newImages.push(file[idx]);
        // for new
        this.productImages.push(file[idx]);
      }
    }
    );
    this.newImages.forEach(image => {

        if (this.ImageOne === this.displayImage ) {
            this.ImageOne = image;
            this.newImages = [];
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.ImageOne = event.target.result;
            };
             reader.readAsDataURL(this.ImageOne);
        } else if (this.ImageTwo === this.displayImage) {
            this.ImageTwo = image;
            this.newImages = [];
            const reader = new FileReader();
            reader.onload = (event: any) => {

              this.ImageTwo = event.target.result;
            };
             reader.readAsDataURL(this.ImageTwo);
        } else if (this.ImageThree === this.displayImage) {
            this.ImageThree = image;
            this.newImages = [];
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.ImageThree = event.target.result;
            };
           reader.readAsDataURL(this.ImageThree);
        } else if (this.ImageFour === this.displayImage) {
            this.ImageFour = image;
            this.newImages = [];
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.ImageFour = event.target.result;
            };
             reader.readAsDataURL(this.ImageFour);
        } else if (this.ImageFive === this.displayImage) {
          this.ImageFive = image;
          this.newImages = [];
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.ImageFive = event.target.result;
          };
           reader.readAsDataURL(this.ImageFive);
           this.noMoreImages = true;
      } else {
        this.noMoreImages = true;
        if (this.router.url === '/catalogue/product/edit') {
          this.snackBar.open('Only upto 5 Images can be uploaded', 'ok', {
            duration: 5000,
          });
        }


      }

    });

}

removeImage(index) {
  this.noMoreImages = false;
  const images = JSON.parse(this.EditProduct.product_image);
  const imagePath = 'https://s3.us-east-2.amazonaws.com/swift-spar-local/delivery_app/';
  if (index === 1) {
    if (this.ImageOne.includes(imagePath)) {

      this.deleteImages.push(images[0]);
    }
    this.ImageOne = this.displayImage;
  } else if (index === 2) {
    if (this.ImageTwo.includes(imagePath)) {
      this.deleteImages.push(images[1]);
    }
    this.ImageTwo = this.displayImage;

  } else if (index === 3) {
    if (this.ImageThree.includes(imagePath)) {
      this.deleteImages.push(images[2]);
    }
    this.ImageThree = this.displayImage;
  } else if (index === 4) {
    if (this.ImageFour.includes(imagePath)) {
      this.deleteImages.push(images[3]);
    }
    this.ImageFour = this.displayImage;
  } else if (index === 5) {
    if (this.ImageFive.includes(imagePath)) {
      this.deleteImages.push(images[4]);
      // this.deleteImages.push(this.ImageFive);
    }
    this.ImageFive = this.displayImage;
  }


}

submitForm() {
  this.submitFormStatus = true;
}
addProductForm(form: NgForm, template: TemplateRef<any>) {


    if (this.submitFormStatus === true) {
    this.postSubmit = false;
      if (this.EditProductMode === false) {

      if (this.filesIndex.length > 5 ) {
          this.postSubmit = true;
          this.error = 'Too many Images, Please Upload Only 5';

      } else if (form.valid === false) {
        this.postSubmit = true;
        this.error = 'Mandatory Parameter Missing!';
      } else if (form.valid === true) {
        // --Select--
        if (form.value.superCategory === '' ||
            form.value.category === '' ||
            form.value.subCategory === '') {
              this.postSubmit = true;
              this.error = 'Please Select Valid Categories';
        } else if ( +form.value.mrp < +form.value.sellingPrice) {
              this.postSubmit = true;
              this.error = 'Selling Price cannot be more MRP';
        } else {

        const attributes = [];

        this.table.forEach(row => {
            const obj = {
                'product_spec_id': '',
                'product_spec_name': row.name,
                'product_spec_value': row.values.toString()
            };
            attributes.push(obj);
        });



        const data = {
            form : form,
            images: this.productImages,
            super: (form.value.superCategory === undefined) ? '' : this.superCategories[form.value.superCategory].super_category_id,
            sub: (form.value.subCategory === undefined) ? '' :
                // tslint:disable-next-line:max-line-length
                this.superCategories[form.value.superCategory]
                .category[form.value.category].Sub_Category[form.value.subCategory].sub_category_id,
            cat: (form.value.category === undefined) ? '' :
                this.superCategories[form.value.superCategory].category[form.value.category].category_id,
            attribute: attributes,
            productType: (this.subscriptionStatus === 0) ? this.defaultProductType.toUpperCase() : form.value.productType.toUpperCase()
        };



      //   const data = {
      //     form : form,
      //     images: this.productImages,
      //     super: (form.value.superCategory === undefined) ?
      //              '' : (this.superCategories.length === 0) ? '' :
      //              this.superCategories[form.value.superCategory].super_category_id,

      //     cat: (form.value.category === undefined) ? '' :
      //     (this.superCategories[form.value.superCategory].category.length === 0 ) ? '' :
      //     this.superCategories[form.value.superCategory].category[form.value.category].category_id,
      //     attribute: attributes,
      //     sub: (form.value.subCategory === undefined) ? '' :
      //           (this.superCategories[form.value.superCategory].category.length === 0 ) ? '' :
      //           // tslint:disable-next-line:max-line-length
      //           this.superCategories[form.value.superCategory]
      //         .category[form.value.category].Sub_Category[form.value.subCategory].sub_category_id,

      // };

      // console.log('data', data);
      this.isLoading = true;
      this.productService.addProduct(data)
        .subscribe(
          (response) => {

           if (response.success === 200) {
            //  const Product = {
            //    super : data.super,
            //    cat : data.cat,
            //    sub : data.sub
            //  };
            //  this.localStorageService.set('Product' , Product);
             this.isLoading = false;

             form.reset();
             if (response.data.product_spec.length > 0) {
              this.defaultquantity = '';
              this.tempTable = [];
              this.attributes = [];
              this.tempAttribute = [...response.data.product_spec];
              this.tempAttribute.forEach(attribute => {
                  attribute.product_spec_value.split(',');
                  const singleAttribute = {
                      'product_spec_value_created_on' : attribute.product_spec_value_created_on,
                      'product_spec_value_id' : attribute.product_spec_value_id,
                      'product_pricing_id' : attribute.product_pricing_id,
                      'product_spec_value' : attribute.product_spec_value.split(','),
                      'merchant_id' : attribute.merchant_id,
                      'product_spec_id' : attribute.product_spec_id,
                      'product_spec_name': attribute.product_spec_name,
                      'super_category_id': attribute.super_category_id,
                      'category_id': attribute.category_id,
                      'sub_category_id' : attribute.sub_category_id,
                      'selectedValue' : '',
                      'checked' : false
                  };
                  this.attributes.push(singleAttribute);

                });
                this.modalRef = this.modalService.show(template, {
                  backdrop: 'static'
                });

                const user = JSON.parse(localStorage.getItem('user-data'));
                 if (user.merchant_id !== undefined) {
                  this.snackBar.open('Product Requested To Admin Successfully', 'ok', {
                    duration: 5000,
                  });
                 }

             } else {
                const user = JSON.parse(localStorage.getItem('user-data'));
                if (user.merchant_id !== undefined) {
                 this.snackBar.open('Product Requested To Admin Successfully', 'ok', {
                   duration: 5000,
                 });
                }
                const merchant = JSON.parse(localStorage.getItem('user-data'));
                if (merchant.merchant_id !== null) {
                  this.router.navigate(['/catalogue']);
                } else if (merchant.admin_id !== null) {
                  this.router.navigate(['/merchants/merchant/catalogue']);
                }

             }

           } else {
             // this.postSubmit = true;
             // this.error = response.output.payload.message;
             console.log(response.output.payload.message);
             this.snackBar.open('Somethig went wrong, please try again!', 'Dismiss', {
                duration: 5000,
             });
           }
          },
          (error) => {
            console.log('error', error);
            this.snackBar.open('Somethig went wrong, please try again!', 'Dismiss', {
                duration: 5000,
            });
          }
        );
        }
      }
    } else {
        // edit Mode
        console.log('EditMode');


        const images = [];

        if (this.ImageOne !== this.displayImage) {
            images.push(this.ImageOne);
        } else if (this.ImageTwo !== this.displayImage) {
            images.push(this.ImageTwo);
        } else if (this.ImageTwo !== this.displayImage) {
          images.push(this.ImageTwo);
        } else if (this.ImageThree !== this.displayImage) {
            images.push(this.ImageThree);
        } else if (this.ImageFour !== this.displayImage) {
          images.push(this.ImageFour);
        } else if (this.ImageFive !== this.displayImage) {
          images.push(this.ImageFive);
        }

        if (form.valid === false) {
          this.postSubmit = true;
          this.error = 'Mandatory Parameter Missing!';
        } else if (form.valid === true) {
          // --Select--
          if (form.value.superCategory === '' ||
              form.value.category === '' ||
              form.value.subCategory === '') {
                this.postSubmit = true;
                this.error = 'Please Select Valid Categories';
          } else if ( +form.value.mrp < +form.value.sellingPrice) {
            this.postSubmit = true;
            this.error = 'Selling Price cannot be more MRP';
          } else {

          const attributes = [];

          this.table.forEach(row => {
              const obj = {
                  'product_spec_id': '',
                  'product_spec_name': row.name,
                  'product_spec_value': row.values.toString()
              };
              attributes.push(obj);
          });
          const array = form.controls;
          if (array.sellingPrice.touched === false && array.mrp.touched === false) {
             this.productPricingID = '';
          } else {
            this.productPricingID = this.EditProduct.pricing_array[0].product_pricing_id;
          }


          const data = {
              productId : this.EditProduct.product_id,
              form : form,
              images: this.productImages,
              super: (form.value.superCategory === undefined) ? '' : this.superCategories[form.value.superCategory].super_category_id,
              sub: (form.value.subCategory === undefined) ? '' :
                  // tslint:disable-next-line:max-line-length
                  this.superCategories[form.value.superCategory]
                  .category[form.value.category].Sub_Category[form.value.subCategory].sub_category_id,
              cat: (form.value.category === undefined) ? '' :
                  this.superCategories[form.value.superCategory].category[form.value.category].category_id,
              attribute: attributes,
              product : this.EditProduct,
              deleteImages : this.deleteImages.toString(),
              productType: (this.subscriptionStatus === 0) ? this.defaultProductType.toUpperCase() : form.value.productType.toUpperCase(),
              pricingID : this.productPricingID
          };

          this.isLoading = true;
          this.productService.editProduct(data).subscribe(
            (response) => {

              if (response.success === 200) {
                this.EditProduct = undefined;
                this.isLoading = false;
                const requestMerchant = JSON.parse(localStorage.getItem('request-merchant'));
                const user = JSON.parse(localStorage.getItem('user-data'));
                const merchant = JSON.parse(localStorage.getItem('merchant-data'));
                if (requestMerchant !== null) {
                  this.router.navigate(['/requests']);
                } else if (user.merchant_id !== undefined) {
                    this.router.navigate(['/catalogue']);
                } else  {
                    this.router.navigate(['/merchants/merchant/catalogue']);
                }

              } else {
                console.log(response.output.payload);
                this.snackBar.open('Something went wrong, please try again later', 'Dismiss', {
                  duration: 5000,
                });

                const requestMerchant = JSON.parse(localStorage.getItem('request-merchant'));
                if (requestMerchant !== null) {
                  this.router.navigate(['/requests']);
                }
              }
            },
            (error) => {
              console.log(error);
              this.snackBar.open('Something went wrong, please try again later', 'Dismiss', {
                duration: 5000,
              });
            }
          );
        }
      }
    }
  }
}

  resetForm(form: NgForm) {
    form.reset();
    this.valueOption = [];
  }


  addAttribute(template: TemplateRef<any>) {


    if (this.router.url === '/catalogue/product/edit') {
        console.log(this.defaultProductSuperCategory);
        console.log(this.defaultProductCategory);
        console.log(this.defaultProductSubCategory);
        this.selectedSuper = (this.defaultProductSuperCategory === '') ? undefined : this.superCategories[this.defaultProductSuperCategory];
        this.selectedCategory = (this.defaultProductCategory === '') ? undefined :
                  this.superCategories[this.defaultProductSuperCategory].category[this.defaultProductCategory];
        this.selectedSub = (this.defaultProductSubCategory === '') ? undefined :
                this.superCategories[this.defaultProductSuperCategory].category[this.defaultProductCategory]
                .Sub_Category[this.defaultProductSubCategory];

        this.modalRef = this.modalService.show(template, {
          backdrop: 'static'
        });
    } else if (this.router.url === '/catalogue/product/new') {
        if (this.selectedSuper === undefined) {
          this.snackBar.open('Please Select a Category', 'Dismiss', {duration: 3000});
        } else if (this.selectedSuper.super_category_hasChild === 1 ) {
            if (this.selectedSuper.category.length === 0) {
              this.modalRef = this.modalService.show(template, {
                backdrop: 'static'
              });
            } else if (this.selectedSuper.category.length > 0 && this.selectedCategory === undefined)  {
              this.snackBar.open('Please Select a Category', 'Dismiss', {duration: 3000});
            } else if ( this.selectedCategory.category_hasChild === 2) {
                this.modalRef = this.modalService.show(template, {
                  backdrop: 'static'
                });
            } else if (this.selectedCategory.category_hasChild === 1) {
              if (this.selectedCategory.Sub_Category.length > 0 && this.selectedSub === undefined) {
                this.snackBar.open('Please Select a Category', 'Dismiss', {duration: 3000});
              } else {
                this.modalRef = this.modalService.show(template, {
                  backdrop: 'static'
                });
              }
            }
        } else if (this.selectedSuper.super_category_hasChild === 2) {
          this.modalRef = this.modalService.show(template, {
            backdrop: 'static'
          });
        }
    }


  }

  openAddQuantity(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static'
   });
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  addAttributeForm() {
    const showValues = [];


    if (this.EditProductMode === true) {

      if ( this.editAttributeStatus === true) {
        const attribute = this.EditProduct.pricing_array[0].product_spec;
        const index = attribute.findIndex(val => val.ProductSpecType.product_spec_name === this.keyName );
        const values = [];
          this.valueOption.forEach(val => {
             if (val.checked === true) {
               values.push(val.val);
             }
          });
          const data = {
            valueId : attribute[index].product_spec_value_id,
            specId : attribute[index].ProductSpecType.product_spec_id,
            value : values
          };
          this.productService.editAttribute(data).subscribe(
            (response) => {

              if (response.success === 200) {
                const indexTable = this.table.findIndex( row => row.name === this.keyName);

                // const finalValues = [];
                this.table[indexTable].values = values;

                this.snackBar.open('Edited Attribute Successfully!', 'Dismiss', {
                  duration: 5000,
                });
                // reseting values
                this.keyName = '';
                this.valueOption = [];
                this.modalRef.hide();
                this.fruits = [];
              } else {
                this.snackBar.open('Failed to edit Attributes, please try again!', 'Dismiss', {
                  duration: 5000,
                });
              }
            },
            (error) => {
              console.log(error);
              this.snackBar.open('Failed to edit Attributes, please try again!', 'Dismiss', {
                duration: 5000,
              });
            }
          );

      } else {

        this.valueOption.forEach(value => {
          if (value.checked === true) {
            showValues.push(value.val);
          }
        });

       const obj = {
          'product_spec_id': '',
          'product_spec_name': this.keyName,
          'product_spec_value': showValues.toString()
        };

        const attributes = [];
        attributes.push(obj);

        const data = {
          attribute : attributes,
          product_pricing_id: this.EditProduct.pricing_array[0].product_pricing_id,
          product_sub_category_id: this.EditProduct.product_sub_category_id,
          product_category:  this.EditProduct.product_category,
          product_super_category: this.EditProduct.product_super_category
        };

        this.productService.addAttribute(data).subscribe(
          (response) => {

            if (response.success === 200 ) {


                    if ( this.editAttributeStatus === true) {
                      const index = this.table.findIndex(val => val.name === this.keyName);
                      this.table[index].name = this.keyName;
                      this.table[index].values = showValues;
                    } else {
                      this.table.push({
                        'name': this.keyName,
                        'values': showValues,
                        // 'data' : this.fruits
                      });
                    }


                  // reseting values
                  this.keyName = '';
                  this.valueOption = [];
                  this.modalRef.hide();
                  this.fruits = [];

            // adding it to inventory table



              response.data.forEach(attribute => {
                const singleAttribute = {
                    'product_spec_value_created_on' : attribute.product_spec_value_created_on,
                    'product_spec_value_id' : attribute.product_spec_value_id,
                    'product_pricing_id' : attribute.product_pricing_id,
                    'product_spec_value' : attribute.product_spec_value,
                    'merchant_id' : attribute.merchant_id,
                    'product_spec_id' : attribute.product_spec_id,
                    'product_spec_name': attribute.product_spec_name,
                    'super_category_id': attribute.super_category_id,
                    'category_id': attribute.category_id,
                    'sub_category_id' : attribute.sub_category_id,
                    'selectedValue' : '',
                    'checked' : false
                };
                this.newAttributesAdded.push(singleAttribute);
              });



            // Adding data to Heading Array

            response.data.forEach(spec => {

                const objNew = {
                  product_spec_name : spec.product_spec_name,
                  product_spec_type_values : spec.product_spec_value.split(','),
                  product_spec_id : spec.product_spec_id
                };
                this.Heading.push(objNew);
            });


              this.Heading.sort(function(a, b) {
                return a.product_spec_id - b.product_spec_id;
              });
            const newIndex = this.Heading.findIndex(oneHeading =>
                        JSON.parse(oneHeading.product_spec_id) === JSON.parse(response.data[0].product_spec_id) );


              if (this.InventoryTableEdit.length > 0) {
                  this.InventoryTableEdit.forEach(row => {

                      const newObj = {
                            id : JSON.stringify(response.data[0].product_spec_id),
                            name : ''
                      };
                      row.type.splice(newIndex, 0 , newObj);
                      // row.type.push(newObj);
                  });
              }

            } else {
              console.log(response.output.payload);
              // reseting values
              this.keyName = '';
              this.valueOption = [];
              this.modalRef.hide();
              this.fruits = [];
              this.snackBar.open('Failed to add Attributes, please try again!', 'Dismiss', {
                duration: 5000,
              });
            }

          },
          (error) => {
            console.log(error);
            // reseting values
            this.keyName = '';
            this.valueOption = [];
            this.modalRef.hide();
            this.fruits = [];
            this.snackBar.open('Failed to add Attributes, please try again!', 'Dismiss', {
              duration: 5000,
            });
          }
        );
      }



    } else {

      this.valueOption.forEach(value => {
        if (value.checked === true) {
          showValues.push(value.val);
        }
      });

      if ( this.editAttributeStatus === true) {
        const index = this.table.findIndex(val => val.name === this.keyName);
        this.table[index].name = this.keyName;
        this.table[index].values = showValues;
      } else {
        this.table.push({
          'name': this.keyName,
          'values': showValues,
          // 'data' : this.fruits
        });
      }


        // reseting values
        this.keyName = '';
        this.valueOption = [];
        this.modalRef.hide();
        this.fruits = [];
    }

  }


  newElement(val) {
    if (val !== '') {
      const obj = {
        val: this.addNewValue,
        checked :  true
      };
      this.valueOption.push(obj);
      this.addNewValue = '';
    }
  }


  uncheck(index) {

    this.valueOption[index].checked = !this.valueOption[index].checked;

  }

  // delete single attribute
  deleteAttribute(index) {


    // this.table.splice(index, 1);
    this.productService.deleteAttribute(this.table[index].id).subscribe(
      (response) => {
          if (response.success === 200) {
            this.table.splice(index, 1);
            this.snackBar.open('Attribute Deleted Successfully!', 'Dismiss', {
              duration: 5000,
            });
          } else {
            console.log(response);
            this.snackBar.open('Something Went Wrong, please try again!', 'Dismiss', {
              duration: 5000,
            });
          }
      }, (error) => {
          console.log(error);
          this.snackBar.open('Something Went Wrong, please try again!', 'Dismiss', {
            duration: 5000,
          });
      }
    );
  }

  // edit single attribute
  editAttribute (template: TemplateRef<any> , index ) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static'
   });

    this.editAttributeStatus = true;
    this.keyName = this.table[index].name;
    this.table[index].values.forEach(val => {
        const obj = {
          val: val,
          checked :  true
        };
      this.valueOption.push(obj);
    });
  }



  onChangeQuantityOption(optionIndex, attribute) {
      this.newAttributes[attribute].selectedValue = optionIndex;
      // attribute.selectedValue = optionIndex;
  }

  addQuantityForm(form: NgForm) {

    if (form.valid === true ) {
      this.quantityError = false;
      const array = [];

      if (this.editQuantityStatus === true ) {
          // const index = this.attributes.findIndex(val => val.selectedValue !== '');
          const index = this.newAttributes.findIndex(val => val.selectedValue === '');
          console.log(this.newAttributes);
          // if (index > -1) {
          if (index < 0) {
          this.attributes.forEach(attribute => {
            if (attribute.selectedValue !== '') {
              const currentRow = this.tempTable[this.editQuantityIndex];
              currentRow.options.forEach (row => {
                   if (attribute.product_spec_id === row.product_spec_id) {
                     row.selectedItem = attribute.selectedValue;
                   }
              });

            }
          });

          this.tempTable[this.editQuantityIndex].quantity = form.value.quantity;

          this.editQuantityStatus = false;
          form.reset();
          this.editQuantityIndex = '';
        } else {
          this.quantityError = true;
          this.quantityErrorMessage = 'Choose all attribute';
        }
      } else {
        // val => val.name === this.keyName
        // const index = this.attributes.findIndex(val => val.selectedValue !== '');
        const index = this.newAttributes.findIndex(val => val.selectedValue === '');
        console.log(this.newAttributes);
        if (index < 0) {
          this.attributes.forEach(attribute => {
            const arry2 = {
              selectedItem : attribute.selectedValue,
              product_spec_id : attribute.product_spec_id,
              product_spec_name : attribute.product_spec_name,
              product_pricing_id : attribute.product_pricing_id
              };
              array.push(arry2);
              attribute.selectedValue = '';
          });

            const currentRow = {
              options : array,
              quantity : form.value.quantity
            };
            this.tempTable.push(currentRow);
            console.log(this.tempTable);
            form.reset();
        } else {
          this.quantityError = true;
          this.quantityErrorMessage = 'Choose all attribute';
        }

      }

    } else {
      this.quantityError = true;
    }


    // working case two
    // const array = [...this.attributes];
    // const currentRow = {
    //   options : array,
    //   quantity : form.value.quantity
    // };
    // console.log(array);
    // this.tempTable.push(currentRow);
    // console.log(this.tempTable);




    // this.attributes.forEach(option => {
    //     option.selectedValue = '';
    // });
    // console.log(this.attributes);
    // console.log(this.tempTable);



    // console.log(form.value.quantity);
    // this.attributes.forEach(attribute => {
    //   console.log(JSON.stringify(attribute.selectedValue));
    //   const name = attribute.product_spec_name;
    //   console.log(name, 'form', typeof name);
    //   console.log(form.value[0]);
    // });



    // one working case
    // this.row = Object.values(form.value);
    // const zeroth = this.row[0];
    // this.row.splice(0, 1);
    // this.row.push(zeroth);
    // this.quantityTable.push(this.row);
    // console.log(this.quantityTable);

  }


  // delete quantity
  deleteQuantity(index) {
    this.tempTable.splice(index, 1);
  }

  // edit Quantity
  editQuantity(index) {
    // this.attributes
    this.editQuantityStatus = true;
    this.defaultquantity = this.tempTable[index].quantity;
    this.editQuantityIndex = index;
  }


  // save inventory
  saveQuantity() {
    const final = [];
    this.tempTable.forEach(row => {
      const optionArray = [];
      row.options.forEach (option => {
        if (option.selectedItem !== '') {
          optionArray.push(option.product_spec_id + '_' + option.selectedItem);
        }

      });
      const id = row.options[0].product_pricing_id;
      const array = [...optionArray].toString();
      const finalObj = {
        product_spec_values : array,
        product_pricing_id : id,
        product_inventory : row.quantity
      };
      final.push(finalObj);
    });


    console.log(final);
    this.productService.addQuantity(final).subscribe(
      (response) => {
        if (response.success === 200) {
          this.tempTable = [];
          this.attributes = [];
          this.defaultquantity = '';
          this.modalRef.hide();
          const user = JSON.parse(localStorage.getItem('user-data'));
          if (this.EditProductMode === true) {
            // Heading // InventoryTableEdit
                // this.EditProductMode = false;

              response.data.forEach(quantity => {
                  const rowTable = {
                    quantity: quantity.product_inventory,
                    type : quantity.product_spec_values.split(',')

                  };
                  rowTable.type.forEach(val => {
                    const data = val.split('_');
                      const saveQuantity = {
                            id : data[0],
                            name : data[1]
                      };
                      this.tempAttributeArray.push(saveQuantity);
                  });
                  if (this.tempAttributeArray.length < this.Heading.length) {
                      this.Heading.forEach(attribute => {
                          const index = this.tempAttributeArray.findIndex(val => JSON.parse(val.id) === attribute.product_spec_id );
                          if (index < 0) {
                            const obj = {
                              id : attribute.product_spec_id,
                              name : ''
                            };
                            this.tempAttributeArray.push(obj);
                          }
                      });
                  }
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



              this.router.navigate(['/catalogue/product/edit']);
          } else {
              if (user.merchant_id !== undefined) {
                this.router.navigate(['/catalogue']);
                this.snackBar.open('Product Requested To Admin Successfully', 'ok', {
                  duration: 5000,
                });
              } else if (user.admin_id !== undefined) {
                this.router.navigate(['/merchants/merchant/catalogue']);
              }
          }

        } else {
          console.log(response);
          this.snackBar.open('Something Went Wrong, please try again!', 'Dismiss', {
            duration: 5000,
          });
        }
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Something Went Wrong, please try again!', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }



  // Edit Quantity
  deleteQuantityEdit (index) {
    this.productService.deleteInventory(this.InventoryTableEdit[index].inventory_id).subscribe(
      (response) => {
        if (response.success === 200) {
          this.InventoryTableEdit.splice(index, 1);
          this.snackBar.open('Inventory Deleted Successfully!', 'Dismiss', {
            duration: 5000,
          });
        } else {
            console.log(response);
            this.snackBar.open('Something went wrong please try again', 'Dismiss', {
              duration: 5000,
            });
        }

      }, (error) => {
        console.log(error);
        this.snackBar.open('Something went wrong please try again', 'Dismiss', {
          duration: 5000,
        });
      }
    );
  }

  editQuantityEdit(index, template: TemplateRef<any> ) {
    this.EditQuantityIndexValue = index;
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static'
   });
    this.EditQuantityArray = [];
    const key = [];
    this.InventoryTableEdit[index].type.forEach(val => {
      key.push(val.name);
    });
    this.Heading.forEach(val => {
      const array = this.InventoryTableEdit[index].type;
      const indexVal = array.findIndex
      (value => JSON.parse(value.id) === JSON.parse(val.product_spec_id));

      const obj = {
        product_spec_id : val.product_spec_id,
        product_spec_name: val.product_spec_name,
        selectedVal : this.InventoryTableEdit[index].type[indexVal].name
      };
      this.EditQuantityArray.push(obj);

    });
   this.EditQuantity = this.InventoryTableEdit[index].quantity;

  }


  editQuantityForm(form: NgForm) {

      const value =  [];
      const inventory = this.InventoryTableEdit[this.EditQuantityIndexValue];
      inventory.type.forEach(val => {
        const string = val.id + '_' + val.name;
        value.push(string);
      });
      const actual = this.EditProduct.pricing_array[0].product_inventory;
      const index = actual.findIndex(val => val.product_inventory_id === inventory.inventory_id);
      // const index2 = actual.findIndex(val => val.product_spec_values === value.toString());

      if (index < 0) {
        this.snackBar.open('Something went wrong please try again', 'Dismiss', {
          duration: 5000,
        });
      } else {
          const data = {
            id : actual[index].product_inventory_id,
            inventory : inventory.quantity,
            value : actual[index].product_spec_values
          };

          this.productService.editInventory(data).subscribe(
            (response) => {
              if (response.success === 200) {
                this.snackBar.open('Quantity Updated successfully!', 'Dismiss', {
                  duration: 5000,
                });
              } else {
                this.snackBar.open('Something went wrong please try again', 'Dismiss', {
                  duration: 5000,
                });
              }
          }, (error) => {
              console.log(error);
              this.snackBar.open('Something went wrong please try again', 'Dismiss', {
                duration: 5000,
              });
          });
          this.EditQuantityArray = [];
          this.InventoryTableEdit[this.EditQuantityIndexValue].quantity = form.value.quantity;
          this.EditQuantityIndexValue = undefined;
          form.reset();
          this.EditQuantity = undefined;
          this.modalRef.hide();

      }




  }

  // open qunatity modal when adding only quantity
  addQuantityModal(template) {
    this.newAttributes = [] ;

    this.attributes.forEach(attribute => {
      if (attribute.checked === true) {
          this.newAttributes.push(attribute);
      }
    });

    this.modalRef.hide();
    this.defaultquantity = '';
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static'
    });
    // // use when going back
    // this.tempTable = [];
    // this.attributes = [];
    // this.tempAttribute = [...this.EditProduct.pricing_array[0].product_spec, ...this.newAttributesAdded];
    // this.tempAttribute.forEach(attribute => {
    //     attribute.product_spec_value.split(',');
    //     const singleAttribute = {
    //         'product_spec_value_created_on' : attribute.product_spec_value_created_on,
    //         'product_spec_value_id' : attribute.product_spec_value_id,
    //         'product_pricing_id' : attribute.product_pricing_id,
    //         'product_spec_value' : attribute.product_spec_value.split(','),
    //         'merchant_id' : attribute.merchant_id,
    //         'product_spec_id' : attribute.product_spec_id,
    //         'product_spec_name': (attribute.ProductSpecType === undefined)
    //                               ? attribute.product_spec_name : attribute.ProductSpecType.product_spec_name,
    //         'super_category_id': (attribute.ProductSpecType === undefined)
    //                               ? attribute.super_category_id : attribute.ProductSpecType.super_category_id,
    //         'category_id':  (attribute.ProductSpecType === undefined)
    //                         ? attribute.category_id : attribute.ProductSpecType.category_id,
    //         'sub_category_id' : (attribute.ProductSpecType === undefined)
    //                           ? attribute.sub_category_id : attribute.ProductSpecType.sub_category_id,
    //         'selectedValue' : ''
    //     };
    //     this.attributes.push(singleAttribute);

    //   });

  }

  ngOnDestroy() {
    this.tempTable = [];
    this.attributes = [];
  }

  cancelInventory () {
    this.modalRef.hide();
    const user = JSON.parse(localStorage.getItem('user-data'));
      if (user.merchant_id !== undefined) {
        this.router.navigate(['/catalogue']);
      } else if (user.admin_id !== undefined) {

        if (this.router.url === '/catalogue/product/new') {
          this.router.navigate(['/merchants/merchant/catalogue']);
        }
      }
  }


  onChangeSubcategory(subcategoryIndex) {
      this.selectedSub = this.subCategory[subcategoryIndex];
  }

  openModalToSelectAttributes(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);

    // use when going back
    this.tempTable = [];
    this.attributes = [];
    this.tempAttribute = [...this.EditProduct.pricing_array[0].product_spec, ...this.newAttributesAdded];
    console.log(this.tempAttribute);
    this.tempAttribute.forEach(attribute => {
        attribute.product_spec_value.split(',');
        const singleAttribute = {
            'product_spec_value_created_on' : attribute.product_spec_value_created_on,
            'product_spec_value_id' : attribute.product_spec_value_id,
            'product_pricing_id' : attribute.product_pricing_id,
            'product_spec_value' : attribute.product_spec_value.split(','),
            'merchant_id' : attribute.merchant_id,
            'product_spec_id' : attribute.product_spec_id,
            'product_spec_name': (attribute.ProductSpecType === undefined)
                                  ? attribute.product_spec_name : attribute.ProductSpecType.product_spec_name,
            'super_category_id': (attribute.ProductSpecType === undefined)
                                  ? attribute.super_category_id : attribute.ProductSpecType.super_category_id,
            'category_id':  (attribute.ProductSpecType === undefined)
                            ? attribute.category_id : attribute.ProductSpecType.category_id,
            'sub_category_id' : (attribute.ProductSpecType === undefined)
                              ? attribute.sub_category_id : attribute.ProductSpecType.sub_category_id,
            'selectedValue' : '',
            'checked' : false
        };
        this.attributes.push(singleAttribute);

      });
  }

  attributeClicked(i) {
     this.attributes[i].checked = !this.attributes[i].checked;
  }
}


