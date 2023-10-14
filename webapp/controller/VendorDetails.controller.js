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
        _handleRouteMatched: async function(oEvent){
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            if(localStorage.getItem("email") && localStorage.getItem("password")){
              await this._login(localStorage.getItem("email"), localStorage.getItem("password"));
            }else{
              this.getOwnerComponent().getRouter().navTo("login");
              return;
            }
          }
        },
        onDeactivateVendor: async function(oEvent){
          var sVendor = this.getOwnerComponent().getModel("VendorDetailModel").getProperty("/vendorcode");
          var sResponse = await models.deactivateVendor(sVendor);
          if(sResponse){
            this._getVendors();
          }
        }
      }
    );
  }
);
