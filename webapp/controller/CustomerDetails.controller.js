sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter"],
  function (Controller, formatter) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.CustomerDetails",
      {
        formatter: formatter,

        onInit: function () {},
      }
    );
  }
);
