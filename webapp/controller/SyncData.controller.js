sap.ui.define(
    ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/m/MessageToast"],
    function (Controller, formatter, MessageToast) {
      "use strict";
  
      return Controller.extend(
        "com.ifb.invoicegenerator.controller.SyncData",
        {
          formatter: formatter,
  
          onInit: function () {},
          onSyncPress: function(oEvent){
            if(this.byId("idStartDate").getDateValue() == null || this.byId("idEndDate").getDateValue() == null){
              MessageToast.show("Please enter valid dates");
              return;
            }

            var Difference_In_Time = this.byId("idEndDate").getDateValue().getTime() - this.byId("idStartDate").getDateValue().getTime();

            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            if(Difference_In_Days >= 31){
              MessageToast.show("Date interval cannot be more than 31 days");
              return;
            }
          }
        }
      );
    }
  );
  