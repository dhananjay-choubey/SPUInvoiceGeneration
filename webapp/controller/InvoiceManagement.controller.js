sap.ui.define(
  [
    "com/ifb/invoicegenerator/controller/BaseController",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, formatter, Filter, Sorter, FilterOperator) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.InvoiceManagement",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter
            .getRoute("invoices")
            .attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: function (oEvent) {
          // Binding based on Model defined in Manifest
          var oDataModel = this.getOwnerComponent().getModel("localData");
          // Country Log Table Binding
          var invoiceTable;
          invoiceTable = this.byId("invoiceTable");
          invoiceTable.setModel(oDataModel);
          invoiceTable.setTableBindingPath("/Invoices");
          invoiceTable.setRequestAtLeastFields(
            "invoicenumber,invoiceDate,SPUNumber,ticketNo,referenceNo,referenceDate,orgId,orgName,partyCode,partyName,consignee,subTotal,sgst,cgst,igst,roundoff,grandTotal");
          invoiceTable.rebindTable();
        },
        onBeforeRebindTable: function (oEvt) {
          //get filters
         // var aFilters = this.getFilters();
          var oBindingParams = oEvt.getParameter("bindingParams");
          var oEvtSorter = oEvt.getParameters().bindingParams.sorter[0];
          var oSorter;
          //bind filters
          //oBindingParams.filters = aFilters;

          //bind sort //10/28
          if (oEvtSorter !== undefined) {
            oSorter = new Sorter(oEvtSorter.sPath, oEvtSorter.bDescending);
            oBindingParams.sorter = oSorter;
          } else {
            oSorter = new Sorter("invoicenumber", true);
            oBindingParams.sorter = oSorter;
          }
        },
        onSearch: function () {
          this.getView().byId("invoiceTable").rebindTable();
        },
        onSort: function () {
          var oSmartTable = this.getView().byId("invoiceTable");
          if (oSmartTable) {
            oSmartTable.openPersonalisationDialog("Sort");
          }
        },
      }
    );
  }
);
