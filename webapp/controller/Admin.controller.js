sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter"],
  function (Controller, formatter) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Admin", {
      formatter: formatter,

      onInit: function () {
        //First do the backend call to validate the user
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("admin").attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (oEvent) {
        console.log("onROuteMatched triggered");
      },
      onMaterialPress: function (oEvent) {
        this.getOwnerComponent().getRouter().navTo("material");
      },
      onBranchUserPress: function () {
        this.getOwnerComponent().getRouter().navTo("customer");
      },
      onFranchiseePress: function () {
        this.getOwnerComponent().getRouter().navTo("vendor");
      },
      onAppUsersPress: function () {
        this.getOwnerComponent().getRouter().navTo("users");
      },
    });
  }
);
