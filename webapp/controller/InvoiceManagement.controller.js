sap.ui.define(
  [
    "com/ifb/invoicegenerator/controller/BaseController",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "com/ifb/invoicegenerator/model/models"
  ],
  function (Controller, formatter, Filter, Sorter, FilterOperator, models) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.InvoiceManagement",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter.getRoute("invoices").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: function (oEvent) {
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            this.getOwnerComponent().getRouter().navTo("admin");
          }
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
          var aFilters = this.getFilters();
          var oBindingParams = oEvt.getParameter("bindingParams");
          var oEvtSorter = oEvt.getParameters().bindingParams.sorter[0];
          var oSorter;
          //bind filters
          oBindingParams.filters = aFilters;

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
        clearFilters: function () {
          var oView = this.getView();
          oView.byId("invoiceDateRange").setValue("");
          oView.byId("invoiceFreeSearch").setValue("");
          oView.byId("invoiceFreeTicketSearch").setValue("");
          oView.byId("invoiceParty").setSelectedKey("");
          oView.byId("invoiceFreeRefSearch").setValue("");
    
        },
        onClear: function (oEvent) {
          this.clearFilters();
          this.onSearch();
        },
        onReset: function () {
          var oView = this.getView();
          oView.byId("invoiceDateRange").setValue("");
          oView.byId("invoiceFreeSearch").setValue("");
          oView.byId("invoiceFreeTicketSearch").setValue("");
          oView.byId("invoiceParty").setSelectedKey("");
          oView.byId("invoiceFreeRefSearch").setValue("");
        },
        getFilters: function(){

			var oView = this.getView();
			var aFilter = [];

			//clear unchosen filters
			var aFiltersVisible = this.getView().byId("filterbar").getAllFilterItems();
			for (var i = 0; i < aFiltersVisible.length; i++) {
				if (!aFiltersVisible[i].getVisibleInFilterBar()) {
					//for select/combo box
					if (aFiltersVisible[i].getProperty("name") === "gmPartyLabel") {
						aFiltersVisible[i].getControl().setSelectedKey("");
						//for checkbox
					} else {
						aFiltersVisible[i].getControl().setValue("");
					}
				}
			}

			//Invoice Date
			if (oView.byId("invoiceDateRange").getDateValue()) {
				aFilter.push(new Filter("invoiceDate", "EQ", oView.byId("gmDateRange").getValue()));
			}

			//Invoice Id
			if (oView.byId("invoiceFreeSearch").getValue() !== "") {
				aFilter.push(new Filter("invoicenumber", "Contains", oView.byId("invoiceFreeSearch").getValue()));
			}

			//Ticket No
			if (oView.byId("invoiceFreeTicketSearch").getValue() !== "") {
				aFilter.push(new Filter("ticketNo", "Contains", oView.byId("invoiceFreeTicketSearch").getValue()));
			}

      //Reference No
			if (oView.byId("invoiceFreeRefSearch").getValue() !== "") {
				aFilter.push(new Filter("referenceNo", "Contains", oView.byId("invoiceFreeRefSearch").getValue()));
			}

			//Party
			if (oView.byId("invoiceParty").getSelectedKey() !== "") {
					aFilter.push(new Filter("partyCode", "EQ", oView.byId("invoiceParty").getSelectedKey()));
			}

			return aFilter;

        }
      }
    );
  }
);
