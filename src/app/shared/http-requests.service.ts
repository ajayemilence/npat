import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
@Injectable()
export class HttpRequestService {

adminRegister;
adminLogin;
adminUpdate;
adminChangePwd;
adminGetAllCategory;
adminGetReqSuper;
adminGetReqCat;
adminGetReqSub;
adminAcceptRejectRequest;
merchantRegister;
merchantLogin;
merchantUpdate;
merchantChangePwd;
getAllMerchant;
merchantSelectSuperCat;
merchantGetAllCat;
merchantOtpVerification;
merchantOtpResend;
merchantCheckEmail;
merchantDelete;
merchnatAddDoc;
merchantAllUnverified;
merchantGetDoc;
merchantGetSingle;
merchantVerify;
merchantUpdateDoc;
merchantForgotPwd;
merchantUpdatePwd;
superCatAdd;
superCatUpdate;
superCatGet;
addAttributeCat;
getAttributeCat;
editAttributeCat;

catAdd;
catUpdate;
subCatAdd;
subCatUpdate;
productAdd;
productUpdate;
productGetByCat;
productSearchSpec;
productAddInventory ;
productFilter;
productGetRequested;
productMerchantReq ;
productAddAttributes;
productUpdateAttribute;
productUpdateInventory;
productDeleteInventory;
productDeleteAttribute;
  constructor() {
      // Admin
      this.adminRegister = 'admin/en/register';
      this.adminLogin = 'admin/en/login';
    //   this.adminUpdate = 'admin/en/update_admin';
      this.adminChangePwd = 'admin/en/changePassword_admin';
      this.adminGetAllCategory = 'admin/en/get_all_category_admin';
      this.adminGetReqSuper = 'admin/en/get_requested_super_category';
      this.adminGetReqCat = 'admin/en/get_req_category_admin';
      this.adminGetReqSub = 'admin/en/get_req_sub_category_admin';
      this.adminAcceptRejectRequest = 'admin/en/accept_reject_categories';


      // Merchant
      this.merchantRegister = 'merchant/en/register';
      this.merchantLogin = 'merchant/en/login';
      this.merchantUpdate = 'merchant/en/update_merchant';
      this.merchantChangePwd = 'merchant/en/changePassword_marchant';
      this.merchantCheckEmail = 'merchant/en/check_emial';
      this.getAllMerchant = 'merchant/en/get_all_merchant';
      this.merchantGetDoc = 'merchant/en/get_merchant_doc';
      this.merchnatAddDoc = 'merchant/en/add_merchant_doc';
      this.merchantUpdateDoc = 'merchant/en/update_merchant_doc';
      this.merchantAllUnverified = 'merchant/en/get_unverified_merchant';
      this.merchantVerify = 'merchant/en/update_merchant_verification_status';
      this.merchantDelete = 'merchant/en/delete_multiple_merchant';
      this.merchantGetAllCat = 'merchant/en/get_all_category_merchant';
      this.merchantUpdatePwd = 'merchant/en/updatePassword_merchant';
      this.merchantForgotPwd = 'merchant/en/send_otp_forgot_password';


      this.merchantGetSingle = 'merchant/en/get_single_merchant';
      this.merchantOtpResend = 'merchant/en/otp_resend';
      this.merchantSelectSuperCat = 'merchant/en/select_super_category';

      this.merchantOtpVerification = 'merchant/en/otp_verification';


      // super Category
      this.superCatAdd = 'super_category/en/add_super_category';
      this.superCatUpdate = 'super_category/en/update_super_category';
      this.superCatGet = 'super_category/en/get_all_super_category';
      this.addAttributeCat = 'product_attributes/en/add_product_attributes_type';
      this.getAttributeCat = 'product_attributes/en/get_product_attributes_type';
      this.editAttributeCat = 'product_attributes/en/update_product_attributes_type';



      // Category
      this.catAdd = 'category/en/add_category';
      this.catUpdate = 'category/en/update_category';

      // Sub Category
      this.subCatAdd = 'sub_category/en/add_sub_category';
      this.subCatUpdate = 'sub_category/en/update_category';

      // Product
      this.productAdd = 'product/en/add_product';
      this.productUpdate = 'product/en/update_product';
      this.productGetByCat = 'product/en/get_products_by_category';
      this.productSearchSpec = 'product_attributes/en/search_product_spec_types';
      this.productAddInventory = 'product_attributes/en/add_product_inventory';
      this.productAddAttributes = 'product/en/add_product_attributes';
      this.productUpdateInventory = 'product_attributes/en/update_product_inventory';
      this.productUpdateAttribute = 'product_attributes/en/update_product_attributes';
      this.productDeleteAttribute = 'product_attributes/en/delete_product_attributes';
      this.productDeleteInventory = 'product_attributes/en/delete_product_inventory';
      this.productGetRequested = 'product/en/get_req_products';
      this.productMerchantReq = 'product/en/get_req_product_merchant';

    //   this.productUpdate = 'product_attributes/en/update_product';

  }
}
