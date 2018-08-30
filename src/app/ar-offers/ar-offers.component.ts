import { Component, OnInit, TemplateRef } from '@angular/core';
import { AROffersService } from './ar-offers.service';
import { MatSnackBar } from '@angular/material';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-ar-offers',
  templateUrl: './ar-offers.component.html',
  styleUrls: ['./ar-offers.component.css']
})
export class ArOffersComponent implements OnInit {
offers;
isLoading = true;
ModalHeader = 'Add Offer';
modalRef: BsModalRef;
displayImage = 'assets/images/camera-icon.gif';

ModalInputTitleField = '';
ModalInputValueField = '';
  constructor(private arOfferService: AROffersService,
              private snackbar: MatSnackBar,
              private modalService: BsModalService
            ) { }

  ngOnInit() {
    this.arOfferService.getoffers().subscribe(
      (response) => {
        this.isLoading = false;
        if (response.success === 200) {
           this.offers = response.data;
        } else {
          console.log(response.output.payload.message);
            this.snackbar.open('Something went wrong, please try again later!', 'Dismiss', {
              duration: 5000
            });
        }
      }, (error) => {
        console.log(error);
        this.snackbar.open('Something went wrong, please try again later!', 'Dismiss', {
          duration: 5000
        });
      }
    );
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


}
