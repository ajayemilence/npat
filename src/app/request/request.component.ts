import { Component, OnInit, TemplateRef } from '@angular/core';
import { RequestService } from './request.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GlobalService } from '../shared/global.service';
import { NgForm } from '@angular/forms';
import { CatalogueService } from '../merchants/merchant/catalogue/catalogue.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  show;
  Heading;
  requests = [
    'one',
    'two',
    'three'
  ];
  array2 = [
    'One'
  ];
  superCategoryRequests ;
  displayImage = 'assets/images/upload.png';
  postSubmit = false;
  error ;
  // modal
  modalRef: BsModalRef;

  templateTitle;
  currentCategoryName;
  currentCategoryDesc;
  currentCategory;
  currentMerchant;
  categoryImage;

  isLoading = true;
  constructor(private requestService: RequestService,
              private modalService: BsModalService,
              private globalService: GlobalService,
              private catalogueService: CatalogueService,
              public snackBar: MatSnackBar
            ) { }

  ngOnInit() {

    const data = {
      last_id: ''
    };

      this.requestService.currentMessage.subscribe(
        (currentMessage) => {
            console.log(currentMessage);
            this.show = currentMessage;
            console.log(this.show);
            if (this.show === 1) {
              this.isLoading = true;
              this.Heading = 'Super Category';
              this.getSuperCategoryRequest(data);
            } else if (this.show === 2) {
              this.isLoading = true;
              this.Heading = 'Category';
              this.getCategoryRequest(data);
            } else if (this.show === 3) {
              this.isLoading = true;
              this.Heading = 'Sub-Category';
              this.getSubCategoryRequest(data);
            } else if (this.show === 4) {
              this.isLoading = true;
              this.Heading = 'Product';
              this.getProductRequest(data);
            }
        }
      );

  }

// get super-category requests

getSuperCategoryRequest(data: any) {
  console.log(data);
  this.requestService.getSuperCategoryRequest(data).subscribe(
    (response) => {
        console.log(response, 'the end');
        if (response.success === 200) {
            this.isLoading = false;
            this.superCategoryRequests = response.data;
        } else {
          this.snackBar.open('Failed To Load Requests', 'Dismiss', {
            duration: 5000,
          });
        }
    },
    (error) => {
        console.log(error);
        this.snackBar.open('Failed To Load Requests', 'Dismiss', {
          duration: 5000,
        });
    }
  );
}

// get Category
getCategoryRequest(data: any) {
  console.log(data);
  this.requestService.getCategoryRequest(data).subscribe(
    (response) => {
      console.log(response, 'the end');
      if (response.success === 200) {
          this.isLoading = false;
          this.superCategoryRequests = response.data;
          console.log(this.superCategoryRequests);
          this.superCategoryRequests.splice(0, 1);
          console.log(this.superCategoryRequests);
      } else {
        this.snackBar.open('Failed To Load Requests', 'Dismiss', {
          duration: 5000,
        });
      }
    },
    (error) => {
        console.log(error);
        this.snackBar.open('Failed To Load Requests', 'Dismiss', {
          duration: 5000,
        });
    }
  );
}

// get Sub Category
getSubCategoryRequest(data: any) {
  console.log(data);
  this.requestService.getSubCategoryRequest(data).subscribe(
    (response) => {
      console.log(response, 'the end');
      if (response.success === 200) {
          this.isLoading = false;
          this.superCategoryRequests = response.data;
          this.superCategoryRequests.splice(0, 1);
          console.log(this.superCategoryRequests);
      } else {
        this.snackBar.open('Failed To Load Requests', 'Dismiss', {
          duration: 5000,
        });
      }
    },
    (error) => {
        console.log(error);
        this.snackBar.open('Failed To Load Requests', 'Dismiss', {
          duration: 5000,
        });
    }
  );
}

requestStatus(categoryID, val) {
    const data = {
      category_type_id: categoryID,
      category_type : this.show,
      status: val
    };

    this.requestService.requestResponse(data).subscribe(
      (response) => {
        console.log(response);
        if (response.success === 200) {
          const message = (val === 0) ? 'Successfully to rejected Request' : 'Successfully to accepted Request';
          this.snackBar.open(message, 'Dismiss', {
            duration: 5000,
          });
          const data2 = {
            last_id: ''
          };


          if (this.show === 1) {
            this.Heading = 'Super Category';
            this.getSuperCategoryRequest(data2);
          } else if (this.show === 2) {
            this.Heading = 'Category';
            this.getCategoryRequest(data2);
          } else if (this.show === 3) {
            this.Heading = 'Sub-Category';
            this.getSubCategoryRequest(data2);
          } else if (this.show === 4) {
            this.Heading = 'Product';
            this.getProductRequest(data2);
          }

        } else {
          const message = (val === 0) ? 'Unsuccessful to reject Request' : 'Unsuccessful to accept Request';
          this.snackBar.open(message, 'Dismiss', {
            duration: 5000,
          });
        }
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Request Unsuccessful', 'Dismiss', {
          duration: 5000,
        });
      }
    );
}

// get Product
getProductRequest(data: any) {
  console.log(data);
  // this.requestService.getSuperCategoryRequest(data).subscribe(
  //   (response) => {
  //       console.log(response, 'the end');
  //   },
  //   (error) => {
  //       console.log(error);
  //   }
  // );
}


editCategory(merchant, category, template: TemplateRef<any>) {
  // this.displayImage = 'assets/images/upload.png';

  this.currentMerchant = merchant;
  this.currentCategory = category;
  if (category.super_category_id !== undefined) {
    this.templateTitle = 'Edit SuperCategory';
    this.currentCategoryName = category.super_category_name;
    this.currentCategoryDesc = category.super_category_description;
    if (category.super_category_image !== '') {
      this.displayImage = this.globalService.ImagePath + category.super_category_image;
    }

  } else if (category.category_id !== undefined) {
    this.templateTitle = 'Edit Category';
    this.currentCategoryName = category.category_name;
    this.currentCategoryDesc = category.category_description;
    if (category.category_image !== '') {
      this.displayImage = this.globalService.ImagePath + category.category_image;
    }
  } else if (category.sub_category_id !== undefined) {
    this.templateTitle = 'Edit Sub Category';
    this.currentCategoryName = category.sub_category_name;
    this.currentCategoryDesc = category.sub_category_description;
    if (category.sub_category_image !== '') {
      this.displayImage = this.globalService.ImagePath + category.sub_category_image;
    }
  }
  // this.currentCategoryName = category.
  this.modalRef = this.modalService.show(template);

}

onFileChange(file: FileList) {
  if (file.length === 0 ) {
    this.displayImage = 'assets/images/upload.png';
  } else {
    this.categoryImage = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.displayImage = event.target.result;
    };
     reader.readAsDataURL(this.categoryImage);
  }

}


editCategoryForm (form: NgForm) {
  // editing super category
  if (form.valid === false ) {
      console.log('form not valid');
  } else if (form.valid === true ) {
    console.log('form valid');
    if (this.currentCategory.super_category_id !== undefined) {
      console.log('supercategoryedit');
      const input = {
        categoryID : this.currentCategory.super_category_id,
        form : form.value,
        image: (this.categoryImage === undefined) ? null : this.categoryImage
      };


      console.log(input, 'Edit super category');
      this.catalogueService.editSuperCategory(input)
      .subscribe(
        (response) => {
        console.log(response);
         if (response.success === 200) {
          console.log(response, 'response');
          this.displayImage = 'assets/images/upload.png';
          form.reset();
          this.modalRef.hide();
          this.snackBar.open('successfully Edited Category', 'Dismiss', {
            duration: 5000,
          });
          // reloading Data
          const data = {
            last_id: ''
          };
          this.getSuperCategoryRequest(data);
         } else {
            this.displayImage = 'assets/images/upload.png';
            form.reset();
            this.modalRef.hide();
            form.reset();
            this.snackBar.open('Unsuccessful to Edit Super Category', 'Dismiss', {
              duration: 5000,
            });
         }
        },
        (error) => {
          console.log('error', error);
        }
      );
    } else if (this.currentCategory.category_id !== undefined) {




      // Editing Category
      const input = {
        categoryID : this.currentCategory.category_id,
        form : form.value,
        image: (this.categoryImage === undefined) ? null : this.categoryImage,
        superID : this.currentCategory.category_parent_super
      };

      this.catalogueService.editCategory(input)
      .subscribe(
        (response) => {
        console.log(response);
         if (response.success === 200) {
          console.log(response, 'response');
          this.displayImage = 'assets/images/upload.png';
          form.reset();
          this.modalRef.hide();
          form.reset();
          this.snackBar.open('successfully Edited Category', 'Dismiss', {
            duration: 5000,
          });
          // reloading Data
          const data = {
            last_id: ''
          };
          this.getCategoryRequest(data);
         } else {
            this.displayImage = 'assets/images/upload.png';
            form.reset();
            this.modalRef.hide();
            form.reset();
            this.snackBar.open('Unsuccessful to Edit Category', 'Dismiss', {
              duration: 5000,
            });
         }
        },
        (error) => {
          console.log('error', error);
        }
      );
    } else if (this.currentCategory.sub_category_id !== undefined) {
      // Editing Sub Category
      const input = {
        categoryID : this.currentCategory.sub_category_id,
        form : form.value,
        image: (this.categoryImage === undefined) ? null : this.categoryImage,
        superID : this.currentCategory.sub_category_parent
      };

      console.log(input, 'editing sub category');

      this.catalogueService.editSubCategory(input)
      .subscribe(
        (response) => {
        console.log(response);
         if (response.success === 200) {
          console.log(response, 'response');
          this.displayImage = 'assets/images/upload.png';
          form.reset();
          this.modalRef.hide();
          form.reset();
          this.snackBar.open('successfully Edited Category', 'Dismiss', {
            duration: 5000,
          });
          // reloading Data
          const data = {
            last_id: ''
          };
          this.getSubCategoryRequest(data);
         } else {
            this.displayImage = 'assets/images/upload.png';
            form.reset();
            this.modalRef.hide();
            form.reset();
            this.snackBar.open('Unsuccessful to Edit Sub Category', 'Dismiss', {
              duration: 5000,
            });
         }
        },
        (error) => {
          console.log('error', error);
        }
      );
    }
  }

}


// resetiing image
  headerClicked() {
    this.displayImage = 'assets/images/upload.png';
  }
}


// editCategoryForm (form: NgForm) {
//   console.log(form);
//   // editing super category
//   if (form.valid === false ) {
//     console.log('form not valid');
//   } else if (form.valid === true) {
//     console.log(this.currentCategory);
//     if (this.currentCategory.super_category_id !== undefined) {
//       const input = {
//         categoryID : this.currentCategory.super_category_id,
//         form : form.value,
//         image: (this.categoryImage === undefined) ? null : this.categoryImage
//       };
//       this.requestService.editSuperCategory(input)
//       .subscribe(
//         (response) => {
//         console.log(response);
//          if (response.success === 200) {
//           console.log(response, 'response');
//           this.displayImage = 'assets/images/upload.png';
//           form.reset();
//           this.modalRef.hide();
//           form.reset();
//           this.snackBar.open('successfully Edited Category', 'Dismiss', {
//             duration: 5000,
//           });
//           // reloading Data
//           const data = {
//             last_id: ''
//           };
//           this.getSuperCategoryRequest(data);
//          } else {
//             this.displayImage = 'assets/images/upload.png';
//             form.reset();
//             this.modalRef.hide();
//             form.reset();
//             this.snackBar.open('Unsuccessful to Edit Super Category', 'Dismiss', {
//               duration: 5000,
//             });
//          }
//         },
//         (error) => {
//           console.log('error', error);
//         }
//       );
//   }
//   console.log(input, 'Edit super category');
//   if (this.show === 1) {
//     this.requestService.editSuperCategory(input)
//     .subscribe(
//       (response) => {
//       console.log(response);
//        if (response.success === 200) {
//         console.log(response, 'response');
//         this.displayImage = 'assets/images/upload.png';
//         form.reset();
//         this.modalRef.hide();
//         form.reset();
//         this.snackBar.open('successfully Edited Category', 'Dismiss', {
//           duration: 5000,
//         });
//         // reloading Data
//         const data = {
//           last_id: ''
//         };
//         this.getSuperCategoryRequest(data);
//        } else {
//           this.displayImage = 'assets/images/upload.png';
//           form.reset();
//           this.modalRef.hide();
//           form.reset();
//           this.snackBar.open('Unsuccessful to Edit Super Category', 'Dismiss', {
//             duration: 5000,
//           });
//        }
//       },
//       (error) => {
//         console.log('error', error);
//       }
//     );
//   } else if (this.show === 2 ) {
//     console.log(input, '========');
//   }
//   }
// }
