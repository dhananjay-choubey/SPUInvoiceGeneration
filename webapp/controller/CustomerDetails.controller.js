sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter",
  "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, models) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.CustomerDetails",
      {
        formatter: formatter,

        onInit: function () {
        // Get Router Info
        this.oRouter = this.getOwnerComponent().getRouter();
        // Calling _handleRouteMatched before UI Rendering
        this.oRouter.getRoute("customer").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: function(oEvent){
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            this.getOwnerComponent().getRouter().navTo("login");
          }
        },
        onDeactivateCustomer: async function(oEvent){
          var sCustomer = this.getOwnerComponent().getModel("CustomerDetailModel").getProperty("/branchcode");
          var sResponse = await models.deactivateCustomer(sCustomer);
          if(sResponse){
            this._getCustomers();
          }
        }
      }
    );
  }
);
