import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgForm, FormGroup } from '@angular/forms';
import { LocalStorageService } from '../shared/local-storage.service';
import { CatalogueService } from '../merchants/merchant/catalogue/catalogue.service';
import { GlobalService } from '../shared/global.service';
import { MerchantService } from '../merchants/merchants.service';

declare var $: any;


@Component({
  selector: 'app-merchant-catelogue',
  templateUrl: './merchant-catelogue.component.html',
  styleUrls: ['./merchant-catelogue.component.css']
})
export class MerchantCatelogueComponent implements OnInit {
currentMerchant;

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
superCategories = [];
currentSuperCategoryName;
currentSuperCategoryDesc;
editMode = false;
editCategory;
editParentCategory;

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

constructor(private modalService: BsModalService,
            private localStorageService: LocalStorageService,
            private catalogueService: CatalogueService,
            private globalService: GlobalService,
            private merchantService: MerchantService
          ) {}

ngOnInit() {
  // get merchant data
  this.currentMerchant = this.merchantService.getMerchant();
  this.catalogueService.getSuperCategory()
   .subscribe(
     (response) => {
      // console.log(this.superCategories, 'response');
      if (response.success === 200) {
        this.showSuperLoading = false;
        this.superCategories = response.data;
        this.totalSuperCategory = this.superCategories.length;



         // get Products
             if ( this.superCategories[0].super_category_hasChild === 0) {
                this.products = [];
             } else if (this.superCategories[0].super_category_hasChild === 2) {
                this.showProducts(this.superCategories[0]);
             } else if (this.superCategories[0].category[0].category_hasChild === 2) {
                this.showProducts(this.superCategories[0].category[0]);
             } else {
                this.showProducts(this.superCategories[0].category[0].Sub_Category[0]);
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

openModal(template: TemplateRef<any>) {
  this.templateTitle = 'Add a Super Category';
  // super category
  this.currentSuperCategoryName = '';
  this.currentSuperCategoryDesc = '';

  this.modalRef = this.modalService.show(template);
}

addCategoryModel(template: TemplateRef<any>, detail) {
  this.templateTitle = 'Add a Category';
  this.superCategoryName = detail;
  this.modalRef = this.modalService.show(template);
}

addSubCategoryModel(template: TemplateRef<any>, currentSuper, currentCategory) {
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
    image: this.userImage
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
        this.displayImage = 'assets/images/upload.png';
        form.reset();
        this.modalRef.hide();
        this.getData();
        form.reset();
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
      }
    );

  } else {
    this.catalogueService.addSuperCategory(data)
    .subscribe(
      (response) => {
        console.log(response, 'response');
        this.displayImage = 'assets/images/upload.png';
        this.modalRef.hide();
        this.getData();
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
      categoryID : this.editCategory.category_id
    };

    console.log('Edit Mode Enabled', data);

    this.catalogueService.editCategory(data)
   .subscribe(
     (response) => {
       console.log(response, 'response');
       this.displayImage = 'assets/images/upload.png';
       form.reset();
       this.modalRef.hide();
       this.getData();
      // if (response.success === 200) {
      //   this.postSubmit = false;
      //   this.router.navigate(['/']);
      //   this.displayImage = 'assets/images/profile-pic.png';
      // } else {
      //   this.postSubmit = true;
      //   this.error = response.output.payload.message;
      // }
     },
     (error) => {
       console.log('error', error);
     }
   );

  } else {
    console.log('Edit Mode disabled');
    const data = {
      form: form.value,
      image: this.userImage,
      superID: this.superCategoryName.super_category_id
    };
    this.catalogueService.addCategory(data)
   .subscribe(
     (response) => {
       console.log(response, 'response');
       this.displayImage = 'assets/images/upload.png';
       this.modalRef.hide();
       this.getData();
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
      categoryID : this.editCategory.sub_category_id
    };
    console.log('edit mode enabled', data);

    this.catalogueService.editSubCategory(data)
     .subscribe(
       (response) => {
         console.log(response, 'response');
         this.displayImage = 'assets/images/upload.png';
         form.reset();
         this.modalRef.hide();
         this.getData();
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
       }
     );
  } else {
    console.log('edit mode disabled');
    const data = {
      form: form.value,
      image: this.userImage,
      catID: this.currentCategoryName.category_id
    };
    console.log(data);
    this.catalogueService.addSubCategory(data)
     .subscribe(
       (response) => {
         console.log(response, 'response');
         this.displayImage = 'assets/images/upload.png';
         this.modalRef.hide();
         this.getData();
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
        // this.postSubmit = true;
        // this.error = response.output.payload.message;
      }
     },
     (error) => {
       console.log('error', error);
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
    this.productImage = 'assets/images/logo.jpg';
    console.log(category);
    console.log(category.super_category_id, 'inshow', category.super_category_hasChild);
    if (category.super_category_id !== undefined && category.super_category_hasChild === 0) {
      this.products = [];
    } else if (category.super_category_id !== undefined && category.super_category_hasChild === 2) {
      console.log('show super');
      const data = {
        ID : category.super_category_id
      };
      this.getSuperCatProducts(data);

    } else if (category.category_id !== undefined && category.category_hasChild === 0) {
        console.log('show category');
        this.products = [];
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
          this.products = response.data;
          if (response.data.length > 0) {
            const productOne = response.data[0];
            this.productName = productOne.product_name;
            this.productDesc =  productOne.product_description;
            if (productOne.product_image !== '') {
              const imageArray = JSON.parse(productOne.product_image);
              this.productImage = this.globalService.ImagePath + imageArray[0];
            }
          }
          console.log(this.products);
          // this.productPrice = 1;
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  getCatProducts(data) {
    this.productImage = 'assets/images/logo.jpg';
    this.catalogueService.getCategoryProduct(data)
    .subscribe(
      (response) => {
        if (response.success === 200) {
          this.products = response.data;
          if (response.data.length > 0) {
            const productOne = response.data[0];
            this.productName = productOne.product_name;
            this.productDesc =  productOne.product_description;
            if (productOne.product_image !== '') {
              const imageArray = JSON.parse(productOne.product_image);
              this.productImage = this.globalService.ImagePath + imageArray[0];
              console.log(this.productImage);
            }
          }
          // const inventory =
          this.productPrice = 1;
          console.log (this.products);
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }



  getSubCatProducts(data) {
    this.productImage = 'assets/images/logo.jpg';
    this.catalogueService.getSubCategoryProduct(data)
    .subscribe(
      (response) => {
        if (response.success === 200) {
          this.products = response.data;
          if (response.data.length > 0) {
            const productOne = response.data[0];
            this.productName = productOne.product_name;
            this.productDesc =  productOne.product_description;
            if (productOne.product_image !== '') {
              const imageArray = JSON.parse(productOne.product_image);
              this.productImage = this.globalService.ImagePath + imageArray[0];
              console.log(this.productImage);
            }
          }
          // const inventory =
          this.productPrice = 1;
          console.log (this.products);
        }
      },
      (error) => {
        console.log('error', error);
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


}
