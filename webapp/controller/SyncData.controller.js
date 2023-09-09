sap.ui.define(
    ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/m/MessageToast",
    "com/ifb/invoicegenerator/model/models"],
    function (Controller, formatter, MessageToast, models) {
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
          }
        }
      );
    }
  );
  