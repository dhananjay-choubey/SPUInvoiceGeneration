sap.ui.define(
    ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/m/MessageToast",
    "com/ifb/invoicegenerator/model/models", "sap/ui/model/json/JSONModel"],
    function (Controller, formatter, MessageToast, models, JSONModel) {
      "use strict";
  
      return Controller.extend(
        "com.ifb.invoicegenerator.controller.SyncData",
        {
          formatter: formatter,
  
          onInit: function () {
            // Get Router Info
            this.oRouter = this.getOwnerComponent().getRouter();
            // Calling _handleRouteMatched before UI Rendering
            this.oRouter.getRoute("syncinvoice").attachPatternMatched(this._handleRouteMatched, this);
          },
          _handleRouteMatched: function(oEvent){
            if(!this.getOwnerComponent().getModel("LoginDataModel")){
              this.getOwnerComponent().getRouter().navTo("login");
            }
            var sDisable = {};
            sDisable.syncRecords = false;
            sDisable.invoiceGenerate = false;
            sDisable.pdfGenerate = false;

            var oModel = new JSONModel(sDisable);
            this.getView().setModel(oModel, "buttonDisability");
          },
          onSyncPress: async function(oEvent){
            if(this.byId("idStartDate").getDateValue() == null){
              MessageToast.show("Please enter valid date");
              return;
            }

            const date = this.getFirstAndLastDay(this.byId("idStartDate").getDateValue(), "Sync");
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            const sStatusCode = await models.getStatusBeforeSync(this.byId("idStartDate").getValue(), userDetails);
            if(sStatusCode && sStatusCode.messageCode == "00"){
              const response = await models.syncSAPtoDBInvoice(date, userDetails);
              if(response){
                var sDisable = {};
                sDisable.syncRecords = false;
                sDisable.invoiceGenerate = true;
                sDisable.pdfGenerate = false;
                var oModel = new JSONModel(sDisable);
                this.getView().setModel(oModel, "buttonDisability");
              }
            }else {
              MessageToast.show(sStatusCode.messageString)
            }

          },
          onGenerateInvoicePress: async function (oEvent){
            if(this.byId("idStartDate").getDateValue() == null){
              MessageToast.show("Please enter valid date");
              return;
            }

            const date = this.getFirstAndLastDay(this.byId("idStartDate").getDateValue());
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            const sStatusCode = await models.getStatusBeforeSync(this.byId("idStartDate").getValue(), userDetails);
            if(sStatusCode && sStatusCode.messageCode == "02"){
              const response = await models.generateInvoices(date.firstDay, date.lastDay, userDetails.regioncode);
              if(response){
                var sDisable = {};
                sDisable.syncRecords = false;
                sDisable.invoiceGenerate = false;
                sDisable.pdfGenerate = true;
                var oModel = new JSONModel(sDisable);
                this.getView().setModel(oModel, "buttonDisability");
              }
            }else {
              MessageToast.show(sStatusCode.messageString)
            }

          },
          
          getFirstAndLastDay: function(sDate, sOperation) {
            let firstDay = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
            let lastDay = new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0);
            console.log("First day=" + firstDay)
            console.log("Last day = " + lastDay);
             if(sOperation == "Sync"){
              return {
                firstDay: formatter.formatDate(firstDay),
                lastDay: formatter.formatDate(lastDay),
                fiscalYear: sDate.getFullYear()
              }
             }else{
              return {
                firstDay: formatter.formatDateyyyMMdd(firstDay),
                lastDay: formatter.formatDateyyyMMdd(lastDay)
              }
             }
          },
          onGeneratePDFPress: async function(sEvent){
            if(this.byId("idStartDate").getDateValue() == null){
              MessageToast.show("Please enter valid date");
              return;
            }

            const date = this.getFirstAndLastDay(this.byId("idStartDate").getDateValue());
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            const sStatusCode = await models.getStatusBeforeSync(this.byId("idStartDate").getValue(), userDetails);
            if(sStatusCode && sStatusCode.messageCode == "04"){
              const response = await models.generatePDF(date.firstDay, date.lastDay, userDetails.regioncode);
              if(response){
                var sDisable = {};
                sDisable.syncRecords = false;
                sDisable.invoiceGenerate = false;
                sDisable.pdfGenerate = false;
                var oModel = new JSONModel(sDisable);
                this.getView().setModel(oModel, "buttonDisability");
              }
            }else {
              MessageToast.show(sStatusCode.messageString)
            }            
          },
          onDatePickerChange: async function(oEvent){
            var sDisable = {};
            if(oEvent.getSource().getDateValue() == null){
              
              sDisable.syncRecords = false;
              sDisable.invoiceGenerate = false;
              sDisable.pdfGenerate = false;

              var oModel = new JSONModel(sDisable);
              this.getView().setModel(oModel, "buttonDisability");
              return;
            }
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();
            const sStatusCode = await models.getStatusBeforeSync(this.byId("idStartDate").getValue(), userDetails);
            if(sStatusCode && (sStatusCode.messageCode == "00" || sStatusCode.messageCode == "01")){
              sDisable.syncRecords = true;
              sDisable.invoiceGenerate = false;
              sDisable.pdfGenerate = false;
            }else if(sStatusCode && (sStatusCode.messageCode == "02" || sStatusCode.messageCode == "03")){
              sDisable.syncRecords = false;
              sDisable.invoiceGenerate = true;
              sDisable.pdfGenerate = false;
            }else if(sStatusCode && (sStatusCode.messageCode == "04" || sStatusCode.messageCode == "05")){
              sDisable.syncRecords = false;
              sDisable.invoiceGenerate = false;
              sDisable.pdfGenerate = true;
            }else{
              sDisable.syncRecords = false;
              sDisable.invoiceGenerate = false;
              sDisable.pdfGenerate = false;
            }

            var oModel = new JSONModel(sDisable);
            this.getView().setModel(oModel, "buttonDisability");
          }
        }
      );
    }
  );
  