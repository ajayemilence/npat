import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from '../../../shared/local-storage.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  superCategories = [
     {id: 1, name: 'Sports'},
     {id: 2, name: 'Food'}
  ];

  Categories = [
    {id: 1, name: 'Italian'},
    {id: 1, name: 'Maxican'},
 ];

 subCategories = [
  {id: 1, name: 'Pasta'}
 ];

 products = [
  {id: 1, name: 'Burger'}
 ];

modalRef: BsModalRef;
displayImage = 'assets/images/upload.png';
userImage: File = null;
inventory = true;
templateTitle;

constructor(private modalService: BsModalService,
            private localStorageService: LocalStorageService) {}

ngOnInit() {
}

onFileChange(file: FileList) {
  this.userImage = file.item(0);
  const reader = new FileReader();
  reader.onload = (event: any) => {
    this.displayImage = event.target.result;
  };
   reader.readAsDataURL(this.userImage);
}

openModal(template: TemplateRef<any>) {
  this.templateTitle = 'Add a Super Category';
  this.modalRef = this.modalService.show(template);
}

addCategory(template: TemplateRef<any>) {
  this.templateTitle = 'Add a Category';
  this.modalRef = this.modalService.show(template);
}

addSubCategory(template: TemplateRef<any>) {
  this.templateTitle = 'Add a Sub Category';
  this.modalRef = this.modalService.show(template);
}


addProduct(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
}



addSuperCategory(form: NgForm) {
  console.log(form);
}




}
