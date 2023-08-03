sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter"],
  function (Controller, formatter) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.CustomerMaster",
      {
        formatter: formatter,

        onInit: function () {},
      }
    );
  }
);
