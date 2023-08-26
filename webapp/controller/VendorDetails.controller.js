sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter",
  "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, models) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.VendorDetails",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter.getRoute("vendor").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: function(oEvent){
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            this.getOwnerComponent().getRouter().navTo("login");
          }
        },
        onDeactivateVendor: function(oEvent){
          var sVendor = this.getOwnerComponent().getModel("VendorDetailModel").getProperty("/vendorcode");
          models.deactivateVendor(sVendor);
        }
      }
    );
  }
);
