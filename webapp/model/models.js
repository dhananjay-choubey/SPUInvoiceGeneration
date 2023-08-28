sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "com/ifb/invoicegenerator/model/formatter",
    "sap/m/BusyDialog"
  ],
  function (JSONModel, Device, MessageBox, MessageToast, formatter, BusyDialog) {
    "use strict";

    return {

      component: {},

      constructor: function (oComponent) {
        this.component = oComponent;
      },
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },
      createUser: function (sData) {

        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "registration";
          var sBusyDialog = new BusyDialog();

          delete sData.userid;

          sBusyDialog.open();

          $.ajax({
            type: "POST",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            data: JSON.stringify(sData),
            success: function (response) {
              sBusyDialog.close();
              MessageToast.show(response);
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred while creating user", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred while creating user", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;
      },
      getUsers: function (){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "userlist";
          var sBusyDialog = new BusyDialog();

          sBusyDialog.open();

          $.ajax({
            type: "GET",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            success: function (response) {
              sBusyDialog.close();
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;
      },
      changePassword: function(sEmail, sPassword){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "passwordchange";
          var sBusyDialog = new BusyDialog();
          var sData = {
            "email" : sEmail,
            "newPassword" : sPassword
        }

          sBusyDialog.open();

          $.ajax({
            type: "POST",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            data: JSON.stringify(sData),
            success: function (response) {
              sBusyDialog.close();
              MessageToast.show("Password has been changed successfully.");
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred while changing the password", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred while changing the password", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;
      },
      deactivateUser: function(sEmail){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "userdeactivation";
          var sBusyDialog = new BusyDialog();
          var sData = {
            "email" : sEmail
        }

          sBusyDialog.open();

          $.ajax({
            type: "POST",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            data: JSON.stringify(sData),
            success: function (response) {
              sBusyDialog.close();
              MessageToast.show("User Status has been changed successfully.");
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred during user deactivation", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred during user deactivation", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;
      },
      getCustomerList: function (sBranchCode){
        var promise = new Promise((resolve, reject) => {

          var url;
          var sBusyDialog = new BusyDialog();

          if(sBranchCode){
            url = this.component.baseURL + "customermaster?branchcode="+ sBranchCode;
          }else{
            url = this.component.baseURL + "customermaster";
          }


          sBusyDialog.open();

          $.ajax({
            type: "GET",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            success: function (response) {
              sBusyDialog.close();
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;        
      },
      getVendorList: function (sBranchCode, sVendorCode){
        var promise = new Promise((resolve, reject) => {

          var url;
          var sBusyDialog = new BusyDialog();

          if(sBranchCode && sVendorCode){
            url = this.component.baseURL + "vendormaster?branchcode="+ sBranchCode + "&vendorcode=" + sVendorCode;
          }else if(sBranchCode && !sVendorCode){
            url = this.component.baseURL + "vendormaster?branchcode="+ sBranchCode;
          }else if(!sBranchCode && sVendorCode){
            url = this.component.baseURL + "vendormaster?vendorcode="+ sVendorCode;
          }else{
            url = this.component.baseURL + "vendormaster";
          }


          sBusyDialog.open();

          $.ajax({
            type: "GET",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            success: function (response) {
              sBusyDialog.close();
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;        
      },
      login: function (sEmail, sPassword){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "newlogin";
          var sBusyDialog = new BusyDialog();
          var sData = {
            "email": sEmail,
            "password": sPassword
          }

          sBusyDialog.open();

          $.ajax({
            type: "POST",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            data: JSON.stringify(sData),
            success: function (response) {
              sBusyDialog.close();
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;         
      },
      getMaterials: function(){
        var promise = new Promise((resolve, reject) => {

          var sBusyDialog = new BusyDialog();
          var url = this.component.baseURL + "materialmaster";

          sBusyDialog.open();

          $.ajax({
            type: "GET",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            success: function (response) {
              sBusyDialog.close();
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;          
      },
      deactivateVendor: function(sVendor){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "vendordeactivation";
          var sBusyDialog = new BusyDialog();
          var sData = {
            "vednorcode": sVendor
          }

          sBusyDialog.open();

          $.ajax({
            type: "POST",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            data: JSON.stringify(sData),
            success: function (response) {
              sBusyDialog.close();
              MessageToast.show(sVendor + " is deactivated successfully");
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred while vendor deactivation", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred while vendor deactivation", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;           
      },
      deactivateCustomer: function(sCustomer){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "customerdeactivation";
          var sBusyDialog = new BusyDialog();
          var sData = {
            "branchcode": sCustomer
          }

          sBusyDialog.open();

          $.ajax({
            type: "POST",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            data: JSON.stringify(sData),
            success: function (response) {
              sBusyDialog.close();
              MessageToast.show(sCustomer + " is deactivated successfully");
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred while customer deactivation", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred while customer deactivation", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;           
      },
      deactivateMaterial: function(sMaterialCode){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "materialdeactivation";
          var sBusyDialog = new BusyDialog();
          var sData = {
            "materialcode": sMaterialCode
          }

          sBusyDialog.open();

          $.ajax({
            type: "POST",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            data: JSON.stringify(sData),
            success: function (response) {
              sBusyDialog.close();
              MessageToast.show(sMaterialCode + " is deactivated successfully");
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred while material deactivation", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred while material deactivation", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;           
      }
    };
  }
);
