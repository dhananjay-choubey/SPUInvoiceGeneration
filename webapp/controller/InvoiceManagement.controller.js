sap.ui.define(
  [
    "com/ifb/invoicegenerator/controller/BaseController",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "com/ifb/invoicegenerator/model/models",
    "sap/ui/model/json/JSONModel"
  ],
  function (Controller, formatter, Filter, Sorter, FilterOperator, models, JSONModel) {
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
            this.getOwnerComponent().getRouter().navTo("login");
          }
          this.getVendorList();
          this.setTableData();

          //var oDataModel = new JSONModel(data);
          // Binding based on Model defined in Manifest
         // var oDataModel = this.getOwnerComponent().getModel("localData");
          // Country Log Table Binding
          // var invoiceTable;
          // invoiceTable = this.byId("invoiceTable");
          // invoiceTable.setModel(oDataModel);
          // invoiceTable.setTableBindingPath("/");
          // invoiceTable.setRequestAtLeastFields(
          //   "InvoiceNumber,InvoiceDate,SPUNumber,CRMTicketNumber,DocumentNumber,DocumentDate,VendorName,VendorCode,CustomerName,CustomerCode,ShipToPartyNumber,ShipToPartyName,SubTotal,SGST,CGST,IGST,RoundOff,GrandTotal");
          
          // invoiceTable.rebindTable();
        },
        getVendorList: async function(){
          var sBranchCode, sVendorCode;
          var sLoginModel = this.getOwnerComponent().getModel("LoginDataModel");
          if(sLoginModel.getProperty("/usertype") == "V"){
            sVendorCode = sLoginModel.getProperty("/refid")
          }else if(sLoginModel.getProperty("/usertype") == "C"){
            sBranchCode = sLoginModel.getProperty("/refid")
          }
          var sData = await models.getVendorList(sBranchCode, sVendorCode);
          var oModel = new JSONModel(sData);
			    this.getOwnerComponent().setModel(oModel, "VendorListModel");
        },
        setTableData: async function(){
          var sDate = new Date(), firstDay, lastDay;
          if (this.getView().byId("invoiceDateRange").getDateValue()) {
            var startDate = this.getView().byId("invoiceDateRange").getTo();
            var endDate = this.getView().byId("invoiceDateRange").getFrom();
            firstDay = formatter.formatDateyyyMMdd(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
            lastDay = formatter.formatDateyyyMMdd(new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0));
          }else{
            firstDay = formatter.formatDateyyyMMdd(new Date(sDate.getFullYear(), sDate.getMonth(), 1));
            lastDay = formatter.formatDateyyyMMdd(new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0));
          }
          
          const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();
          var sVendorCode;
          if(userDetails.usertype == "V"){
            sVendorCode = userDetails.refid;
          }else {
            sVendorCode = "";
          }
          var response = await models.getInvoiceData(firstDay, lastDay, userDetails.regioncode, sVendorCode);
          var oDataModel = new JSONModel(response);
          var invoiceTable;
          invoiceTable = this.byId("invoiceTable");
          invoiceTable.setModel(oDataModel);
          invoiceTable.setTableBindingPath("/");
          invoiceTable.setRequestAtLeastFields(
            "InvoiceNumber,InvoiceDate,SPUNumber,CRMTicketNumber,DocumentNumber,DocumentDate,VendorName,VendorCode,CustomerName,CustomerCode,ShipToPartyNumber,ShipToPartyName,SubTotal,SGST,CGST,IGST,RoundOff,GrandTotal");
          
          invoiceTable.rebindTable();
        },
        onBeforeRebindTable: function (oEvt) {
          //this.setTableData();
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
            oSorter = new Sorter("InvoiceNumber", true);
            oBindingParams.sorter = oSorter;
          }
        },
        onSearch: function () {
          this.setTableData();
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
				aFilter.push(new Filter("InvoiceDate", "GE", oView.byId("invoiceDateRange").getTo()));
        aFilter.push(new Filter("InvoiceDate", "LE", oView.byId("invoiceDateRange").getFrom()));
			}

			//Invoice Id
			if (oView.byId("invoiceFreeSearch").getValue() !== "") {
				aFilter.push(new Filter("InvoiceNumber", "Contains", oView.byId("invoiceFreeSearch").getValue()));
			}

			//Ticket No
			if (oView.byId("invoiceFreeTicketSearch").getValue() !== "") {
				aFilter.push(new Filter("CRMTicketNumber", "Contains", oView.byId("invoiceFreeTicketSearch").getValue()));
			}

      //Reference No
			if (oView.byId("invoiceFreeRefSearch").getValue() !== "") {
				aFilter.push(new Filter("DocumentNumber", "Contains", oView.byId("invoiceFreeRefSearch").getValue()));
			}

			//Party
			if (oView.byId("invoiceParty").getSelectedKey() !== "") {
					aFilter.push(new Filter("VendorCode", "EQ", oView.byId("invoiceParty").getSelectedKey()));
			}

			return aFilter;

        }
      }
    );
  }
);
