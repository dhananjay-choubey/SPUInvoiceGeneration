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
          var that = this;
          var settings = {
            "url": url,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": sData
          };

          var sBusyDialog = new BusyDialog();
          sBusyDialog.open();
  
          $.ajax(settings).done(function (response) {
            sBusyDialog.close();
            console.log(response)
            try {
              resolve(response);
            } catch (e) {
              resolve(false);
            }
  
          }.bind(this)).fail(function (error) {
            sBusyDialog.close();
            console.log(error);
            reject(false);
          }.bind(this));
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
      getVendorCustomerList: function (sType){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "getcustomervendor";
          var sBusyDialog = new BusyDialog();
          var sData = {
            "code" : sType
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
      getCustomers: function(){
        
      }
    };
  }
);
