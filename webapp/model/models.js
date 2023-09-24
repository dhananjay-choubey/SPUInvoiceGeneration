sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "com/ifb/invoicegenerator/model/formatter",
    "sap/m/BusyDialog",
    "sap/m/PDFViewer"
  ],
  function (JSONModel, Device, MessageBox, MessageToast, formatter, BusyDialog, PDFViewer) {
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
              MessageToast.show(response.messageString);
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              // MessageBox.error("Error occurred while creating user", {
              //   title: "Error"
              // });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              // MessageBox.error("Error occurred while creating user", {
              //   title: "Error"
              // });
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
              MessageToast.show("User is deactivated.");
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
      },
      syncSAPtoDBInvoice: function (sDate, sUserData){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "saptodbinvoice";
          var sBusyDialog = new BusyDialog({
            text: "Data sync is in progress from SAP to Franchisee Invoice Generation app.",
            title: "Data sync is in progress!"
          });
          var sData = {
            "CompanyCode": "1000",
            "DocumentNumber": "",
            "EndDate": sDate.lastDay,
            "FiscalYear": sDate.fiscalYear,
            "SegmentCode": sUserData.segment,
            "StartDate": sDate.firstDay,
            "Region": sUserData.regioncode
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
              MessageToast.show(response.messageString);
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred during data sync", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred during data sync", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise; 
      },
      getStatusBeforeSync: function(sDate, userDetails){
        var promise = new Promise((resolve, reject) => {

          var sBusyDialog = new BusyDialog();
          var url = this.component.baseURL + "invoicestatus?monthyear="+sDate+"&region="+userDetails.regioncode;

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
      syncMasterData: function(sOption){
        var promise = new Promise((resolve, reject) => {

          var sBusyDialog = new BusyDialog(), url;
          if(sOption == "Materials"){
            url = this.component.baseURL + "SapToDbMaterial";
          }else if(sOption == "Vendors"){
            url = this.component.baseURL + "SapToDbVendor";
          }else {
            url = this.component.baseURL + "SapToDbCustomer";
          }

          sBusyDialog.open();

          $.ajax({
            type: "GET",  
            url: url,  
            contentType: "application/json; charset=utf-8",  
            dataType: "json",  
            success: function (response) {
              sBusyDialog.close();
              if(response.messageCode == "E"){
                MessageBox.error(response.messageString);
              }else{
                MessageToast.show( sOption + " synced successfully");
                resolve(response);
              }
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error( "Error occurred while syncing "+ sOption);
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error( "Error occurred while syncing "+ sOption);
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;
      },
      getInvoiceData: function(startdate, enddate, region, vendorcode){
        var promise = new Promise((resolve, reject) => {

          var sBusyDialog = new BusyDialog(), url;
          if(vendorcode){
            url = this.component.baseURL + "/GetInvoiceGeneration?startdate=" + startdate + "&enddate=" + enddate + "&region=" +region+ "&vendorcode=" + vendorcode;
          }else{
            url = this.component.baseURL + "/GetInvoiceGeneration?startdate=" + startdate + "&enddate=" + enddate + "&region=" +region;
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
      generateInvoices: function(startDate, endDate, regionCode){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "invoicegeneration";
          var sBusyDialog = new BusyDialog({
            text: "Invoice generation is in progress. It will take time depending on the number of Invoices to be generated.",
            title: "Invoice generation in progress!"
          });
          var sData = {
            "startDate": startDate,
            "endDate": endDate,
            "regionCode": regionCode
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
              MessageToast.show("Invoice generated successfully.");
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred during invoice generation", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred during invoice generation", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;         
      },
      generatePDF: function (startDate, endDate, regionCode){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "pdfgeneration";
          var sBusyDialog = new BusyDialog({
            text: "PDF generation is in progress. It will take time depending on the number of PDF's to be generated.",
            title: "PDF Generation in Progress!"
          });
          var sData = {
            "startDate": startDate,
            "endDate": endDate,
            "regionCode": regionCode
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
              MessageToast.show("PDF generation is in progress in the background, please check the generated PDFs from the Invoice Management Page");
              resolve(response);
            },
            failure: function (response) {
              sBusyDialog.close();
              MessageBox.error("Error occurred during invoice generation", {
                title: "Error"
              });
              console.log(response)
              resolve(false);
            },
            error: function (response){
              sBusyDialog.close();
              MessageBox.error("Error occurred during invoice generation", {
                title: "Error"
              });
              console.log(response);
              resolve(false);
            }
          })
        });
        return promise;          
      },
      getPDF: function(sPath, sDocumentNumber, sOption){
        var promise = new Promise((resolve, reject) => {
          var url = this.component.baseURL + "getpdf";
          var sData = JSON.stringify({
            "InvoicePdfLocation": sPath
          });

          var xhr = new XMLHttpRequest(); 
          xhr.open("POST", url);
          xhr.setRequestHeader("Content-Type", "application/json");
  
          //Here we are modifying responseType dynamically on readystatechanged event
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 2) {
              if (xhr.status == 200) {
                xhr.responseType = "arraybuffer";
              } else {
                xhr.responseType = "text";
              }
            }
          };
  
          xhr.onload = function () {
            if (this.status === 200) {
              var sFileNameheader;
              sFileNameheader = sDocumentNumber;
              //get file extension
              var mimetype;
              mimetype = "application/pdf";
              var blob = new Blob([xhr.response], {
                type: mimetype
              });
              if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(blob, sFileNameheader);
                resolve(true);
              } else {
                var objectUrl = URL.createObjectURL(blob);
                if(sOption == "download"){
                  var a = document.createElement('a');
                  a.download = sFileNameheader;
                  a.href = objectUrl;
                  a.click();
                  window.URL.revokeObjectURL(objectUrl);
                }else{
                  jQuery.sap.addUrlWhitelist("blob");
                  var oPDFViewer = new PDFViewer({
                    source: objectUrl,
                    title: "Invoice for Document - " + sDocumentNumber,
                    showDownloadButton: false
                  });
                  oPDFViewer.open();
                }
                
                resolve(true);
              }
            } else if (this.status === 500) {
              MessageBox.error(JSON.parse(this.responseText).message);
            } else {
              MessageToast.show(JSON.parse(this.responseText).error.message);
            }
          };
          xhr.send(sData);

        });
        return promise;  
      }
    };
  }
);
