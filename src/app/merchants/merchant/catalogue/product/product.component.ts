import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productImage = 'assets/images/logo.jpg';

  superCategories = [
    {id: 1, name: 'Sports'},
    {id: 2, name: 'Food'}
];

Categories = [
  {id: 1, name: 'Italian'},
  {id: 1, name: 'Maxican'},
];

subCategories = [
{id: 1, name: 'Pasta'},
{id: 1, name: 'Pasta'},
{id: 1, name: 'Pasta'}
];
showSubList = false;
togglePanel = {};
// products = [
// {id: 1, name: 'Burger'}
// ];

items;
quarterDataList;
selectedRow;
name: string;
setClickedRow: Function;
isActive: any;
isActive2: any;
isCollapsed = false;

  constructor() {
    this.name = 'Angular! v${VERSION.full}';
    this.items = ['Apple', 'Orange', 'Mango'];
    this.isActive = [];
    this.quarterDataList = [
      {'year': 2017},
      { 'year': 2018},
      { 'year': 2019} ];
       this.setClickedRow = function(index) {
         console.log(index);
            this.selectedRow = index;
        };
   }

  ngOnInit() {
    // $(document).ready(function() {
    //   const accordionsMenu = $('.cd-accordion-menu');

    //   if ( accordionsMenu.length > 0 ) {

    //     accordionsMenu.each(function() {
    //       const accordion = $(this);
    //       // detect change in the input[type='checkbox'] value
    //       accordion.on('change', 'input[type='checkbox']', function() {
    //         const checkbox = $(this);
    //         console.log(checkbox.prop('checked'));
    //         ( checkbox.prop('checked') ) ?
    //         checkbox.siblings('ul').attr('style', 'display:none;').slideDown(300)
    //         : checkbox.siblings('ul').attr('style', 'display:block;').slideUp(300);
    //       });
    //     });
    //   }
    // });
  }

  selectCategory (name: string, i) {
    console.log(name , i);
    this.showSubList = !this.showSubList;
  }
  // showSubList(category) {
  //   console.log(category)
  // }

  onClick(event) {

    const target = event.target;

     if (!target.closest('.border-box')) {
       console.log('hi');
       this.selectedRow = null;
     }
   }

   listClick(event, newValue) {
    console.log(newValue);
    // this.selectedItem = newValue;
    newValue.showSubfolders = !newValue.showSubfolders;
    event.stopPropagation();
  }
}
