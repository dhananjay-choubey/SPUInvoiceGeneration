sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter"],
  function (Controller, formatter) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Login", {
      formatter: formatter,

      onInit: function () {},
      onLoginPressed: function (oEvent) {
        this.getOwnerComponent().getRouter().navTo("admin");
      },
    });
  }
);
