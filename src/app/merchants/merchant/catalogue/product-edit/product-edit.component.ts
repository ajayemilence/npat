import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
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

declare var x;
declare var y;
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
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

newImages = [];
  constructor(private catalogueService: CatalogueService,
              private modalService: BsModalService,
              private productService: ProductService,
              private router: Router,
              public snackBar: MatSnackBar,
              private globalService: GlobalService
            ) { }

  ngOnInit() {
    console.log(this.router.url, 'url');
    this.ImagePath = this.globalService.ImagePath;
    console.log('-----------', this.ImagePath);
    this.catalogueService.getSuperCategory()
   .subscribe(
     (response) => {
      // console.log(this.superCategories, 'response');
      if (response.success === 200) {

         // super categories
         this.superCategories = response.data;
         this.defaultSuper = response.data[0].super_category_name;

         // categories
         this.categories = response.data[0].category;
         this.defaultCategory = response.data[0].category;

         // sub-categories
         if (this.categories.length > 0) {
           this.subCategory = this.categories[0].Sub_Category;
         }

        // if (this.router.url === '/catalogue/product/new' ) {


        // } else
         if (this.router.url === '/catalogue/product/edit' ) {
          this.EditProduct = this.productService.getProduct();
          console.log(this.EditProduct);
          if (this.EditProduct === undefined) {
            console.log('in if');
            const user = JSON.parse(localStorage.getItem('user-data'));
            if (user.admin_id !== undefined) {
              this.router.navigate(['/merchants/merchant/catalogue']);
            } else if (user.merchant_id !== undefined) {
              this.router.navigate(['/catalogue']);
            }
          } else {
            this.EditProductMode = true;
            console.log(response.data);
            this.defaultProductTax = this.EditProduct.product_tax;
            this.defaultProductSku = this.EditProduct.product_sku;
            this.defaultProductName = this.EditProduct.product_name;
            this.defaultProductDesc = this.EditProduct.product_description;
            // this.defaultProductMRP = this.EditProduct.product_tax;
            this.defaultProductSellingPrice = this.EditProduct.pricing_array[0].product_pricing_price;
            this.defaultProductType = this.EditProduct.product_type.toLowerCase();

             const EditProductImages = JSON.parse(this.EditProduct.product_image);
             console.log(EditProductImages, 'images');
           this.ImageOne = (EditProductImages[0] !== undefined) ? this.ImagePath + EditProductImages[0] : this.displayImage;
           this.ImageTwo = (EditProductImages[1] !== undefined) ? this.ImagePath + EditProductImages[1] : this.displayImage;
           this.ImageThree = (EditProductImages[2] !== undefined) ? this.ImagePath + EditProductImages[2] : this.displayImage;
           this.ImageFour = (EditProductImages[3] !== undefined) ? this.ImagePath + EditProductImages[3] : this.displayImage;
           this.ImageFive = (EditProductImages[4] !== undefined) ? this.ImagePath + EditProductImages[4] : this.displayImage;

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

                      const indexSuper = this.superCategories.findIndex(category => JSON.parse(category.super_category_id) ===
                         JSON.parse(superCategory.super_category_id));
                      this.defaultProductSuperCategory = JSON.stringify(indexSuper);
                      this.categories = response.data[indexSuper].category;
                      this.defaultProductCategory = JSON.stringify(index);
                  }
              });
            } else if (this.EditProduct.product_sub_category_id !== '0') {
               // product from sub category
               console.log('sub', this.EditProduct.product_sub_category_id);

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
            this.defaultAvailQuantity = this.EditProduct.product_tax;
          }

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
    this.valueOption = [];
    // autocomplete
     this.productService.getAttribute(searchValue).subscribe(
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
  console.log(value, 'value');
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
    console.log(superCategoryIndex);
    if (superCategoryIndex !== '') {
      this.selectedSuper = this.superCategories[superCategoryIndex];

      this.categories = this.selectedSuper.category;
      if (this.categories.length > 0) {
        this.subCategory = this.categories[0].Sub_Category;
      } else {
        this.subCategory = [];
      }
      console.log(this.selectedSuper, 'super');
      console.log(this.subCategory, 'sub');
      console.log(this.categories, 'cate');
    }

}

onChangeCategory(categoryIndex) {
  console.log(categoryIndex);
  if (categoryIndex !== '--Select--') {
  this.selectedCategory = this.categories[categoryIndex];
  this.subCategory = this.categories[categoryIndex].Sub_Category;
  console.log(this.selectedCategory);
  console.log(this.subCategory);
  }
}

// Register
onFileChange(file: FileList) {
  console.log(file);
  this.productImages = [];
  this.filesIndex = _.range(file.length);
    _.each(this.filesIndex, (idx) => {
      if (idx < 5) {
        this.newImages.push(file[idx]);
        this.productImages.push(file[idx]);
      }
    }
    );
    this.newImages.forEach(image => {

        if (this.ImageOne === this.displayImage ) {
            this.ImageOne = image;
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.ImageOne = event.target.result;
            };
             reader.readAsDataURL(this.ImageOne);
        } else if (this.ImageTwo === this.displayImage) {
            this.ImageTwo = image;
            const reader = new FileReader();
            reader.onload = (event: any) => {
              console.log('====', event.target.result);
              this.ImageTwo = event.target.result;
            };
             reader.readAsDataURL(this.ImageTwo);
        } else if (this.ImageThree === this.displayImage) {
            this.ImageThree = image;
            const reader = new FileReader();
            reader.onload = (event: any) => {
              console.log('-----', event.target.result.length);
              console.log( event.target.result);
              this.ImageThree = event.target.result;
            };
           reader.readAsDataURL(this.ImageThree);
        } else if (this.ImageFour === this.displayImage) {
            this.ImageFour = image;
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.ImageFour = event.target.result;
            };
             reader.readAsDataURL(this.ImageFour);
        } else if (this.ImageFive === this.displayImage) {
          this.ImageFive = image;
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.ImageFive = event.target.result;
          };
           reader.readAsDataURL(this.ImageFive);
      }

    });
    console.log(this.productImages);
}




addProductForm(form: NgForm, template: TemplateRef<any>) {
    console.log(form);
    this.postSubmit = false;

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

      console.log(form);


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
          attribute: attributes
      };
      console.log('data', data);



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
// -------------------------------
    this.productService.addProduct(data)
      .subscribe(
        (response) => {
         console.log(response, 'response');
         if (response.success === 200) {
           console.log(response.data);
           form.reset();
           if (response.data.product_spec.length > 0) {

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
                    'selectedValue' : ''
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
              this.router.navigate(['/catalogue']);
           }

         } else {
           // this.postSubmit = true;
           // this.error = response.output.payload.message;
         }
        },
        (error) => {
          console.log('error', error);
        }
      );
      }
    }
  }

  resetForm(form: NgForm) {
    form.reset();
    this.valueOption = [];
  }


  addAttribute(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, {
      backdrop: 'static'
   });
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
    console.log(this.keyName);
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

    this.keyName = '';
    this.valueOption = [];
    this.modalRef.hide();
    this.fruits = [];
  }


  newElement() {
    const obj = {
      val: this.addNewValue,
      checked :  true
    };
    this.valueOption.push(obj);
    this.addNewValue = '';

  }


  uncheck(index) {
    console.log(index);
    console.log(this.valueOption[index]);
    this.valueOption[index].checked = !this.valueOption[index].checked;
    console.log(this.valueOption[index]);
  }

  // delete single attribute
  deleteAttribute(index) {
    console.log(index);
    console.log(this.table[index]);
    this.table.splice(index, 1);
  }

  // edit single attribute
  editAttribute (template: TemplateRef<any> , index ) {
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static'
   });
    console.log(this.table);
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
      this.attributes[attribute].selectedValue = optionIndex;
      // attribute.selectedValue = optionIndex;
  }

  addQuantityForm(form: NgForm) {
    console.log(form.value.quantity, 'quantity');
    if (form.valid === true ) {
      this.quantityError = false;
      const array = [];
      console.log('editMode' , this.editQuantityStatus);
      if (this.editQuantityStatus === true ) {
          console.log(this.attributes);
          console.log(this.tempTable[this.editQuantityIndex]);

          this.attributes.forEach(attribute => {
            if (attribute.selectedValue !== '') {
              console.log('changed');
              const currentRow = this.tempTable[this.editQuantityIndex];
              console.log(currentRow);
              currentRow.options.forEach (row => {
                   if (attribute.product_spec_id === row.product_spec_id) {
                     console.log(row.selectedItem, 'selected', attribute.selectedItem );
                     row.selectedItem = attribute.selectedValue;
                   }
              });

            }
          });

          this.tempTable[this.editQuantityIndex].quantity = form.value.quantity;

          // this.tempTable.splice(this.editQuantityIndex, 1);
          // this.tempTable.splice(this.editQuantityIndex , 0, editQuantity);
          this.editQuantityStatus = false;
          form.reset();
          this.editQuantityIndex = '';
      } else {
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
          form.reset();
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
    console.log(this.tempTable[index]);
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
         optionArray.push(option.product_spec_id + '_' + option.selectedItem);
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



    this.productService.addQuantity(final).subscribe(
      (response) => {
        if (response.success === 200) {
          this.tempTable = [];
          this.attributes = [];
          this.defaultquantity = '';
          this.modalRef.hide();
          this.router.navigate(['/merchants/merchant/catalogue']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}


