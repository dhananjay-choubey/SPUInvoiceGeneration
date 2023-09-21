sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, models) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.MaterialDetails",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter.getRoute("material").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: function(oEvent){
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            this.getOwnerComponent().getRouter().navTo("login");
          }
        },
        onDeactivateMaterial: async function(oEvent){
          var sMaterial = this.getOwnerComponent().getModel("MaterialDetailModel").getProperty("/materialcode");
          var sResponse = await models.deactivateMaterial(sMaterial);
          if(sResponse){
            this._getMaterials();
          }
        }
      }
    );
  }
);
