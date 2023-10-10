sap.ui.define(
    [
      "com/ifb/invoicegenerator/controller/BaseController",
      "../model/formatter",
      "sap/ui/model/Filter",
      "sap/ui/model/Sorter",
      "sap/ui/model/FilterOperator",
      "com/ifb/invoicegenerator/model/models",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageBox",
      "sap/m/MessageToast",
    ],
    function (Controller, formatter, Filter, Sorter, FilterOperator, models, JSONModel, MessageBox, MessageToast) {
      "use strict";
  
      return Controller.extend(
        "com.ifb.invoicegenerator.controller.FailedInvoices",
        {
          formatter: formatter,
  
          onInit: function () {
            // Get Router Info
            this.oRouter = this.getOwnerComponent().getRouter();
            // Calling _handleRouteMatched before UI Rendering
            this.oRouter.getRoute("failedinvoices").attachPatternMatched(this._handleRouteMatched, this);
          },
          _handleRouteMatched: async function (oEvent) {
            if(!this.getOwnerComponent().getModel("LoginDataModel")){
              if(localStorage.getItem("email") && localStorage.getItem("password")){
                await this._login(localStorage.getItem("email"), localStorage.getItem("password"));
              }else{
                this.getOwnerComponent().getRouter().navTo("login");
              }
            }
            this.clearFilters();
            var sToday = new Date();
            var firstDay = new Date(sToday.getFullYear(), sToday.getMonth(), 1);
            var lastDay = new Date(sToday.getFullYear(), sToday.getMonth() + 1, 0);
            this.byId("invoiceDateRangesync").setDateValue(firstDay);
            this.byId("invoiceDateRangesync").setSecondDateValue(lastDay);

            this.setTableData();
  
          },
          setTableData: async function(){
            var sDate = new Date(), firstDay, lastDay;
            if (this.getView().byId("invoiceDateRangesync").getDateValue()) {
              var startDate = this.getView().byId("invoiceDateRangesync").getFrom();
              var endDate = this.getView().byId("invoiceDateRangesync").getTo();
              firstDay = formatter.formatDateyyyMMdd(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
              lastDay = formatter.formatDateyyyMMdd(new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0));
            }else{
              firstDay = formatter.formatDateyyyMMdd(new Date(sDate.getFullYear(), sDate.getMonth(), 1));
              lastDay = formatter.formatDateyyyMMdd(new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0));
            }

            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            var response = await models.getFailedInvoiceData(firstDay, lastDay, userDetails.segment);
            if(response){
              var oDataModel = new JSONModel(response);
              var invoiceTable;
              invoiceTable = this.byId("invoiceTablesync");
              invoiceTable.setModel(oDataModel);
              invoiceTable.setTableBindingPath("/");
              invoiceTable.setRequestAtLeastFields(
                "InvoiceNumber,InvoiceDate,DocumentNumber,FiscalYear");
              
              invoiceTable.rebindTable();
             }else{
               MessageBox.error(response.messageString);
             }
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
            this.getView().byId("invoiceTablesync").rebindTable();
          },
          onSort: function () {
            var oSmartTable = this.getView().byId("invoiceTablesync");
            if (oSmartTable) {
              oSmartTable.openPersonalisationDialog("Sort");
            }
          },
          clearFilters: function () {
            var oView = this.getView();
            oView.byId("invoiceDateRangesync").setValue("");
            oView.byId("invoiceFreeSearchsync").setValue("");
            oView.byId("invoiceFreeFiscalSearchsync").setValue("");
            oView.byId("invoiceFreeRefSearchsync").setValue("");
      
          },
          onClear: function (oEvent) {
            this.clearFilters();
            this.onSearch();
          },
          onReset: function () {
            var oView = this.getView();
            oView.byId("invoiceDateRangesync").setValue("");
            oView.byId("invoiceFreeSearchsync").setValue("");
            oView.byId("invoiceFreeFiscalSearchsync").setValue("");
            oView.byId("invoiceFreeRefSearchsync").setValue("");
          },
          getFilters: function(){
  
              var oView = this.getView();
              var aFilter = [];
  
              //clear unchosen filters
              var aFiltersVisible = this.getView().byId("filterbarsync").getAllFilterItems();
              for (var i = 0; i < aFiltersVisible.length; i++) {
                  if (!aFiltersVisible[i].getVisibleInFilterBar()) {
                      //for select/combo box

                          aFiltersVisible[i].getControl().setValue("");
                  }
              }
  
              //Invoice Date
              if (oView.byId("invoiceDateRangesync").getDateValue()) {
                  aFilter.push(new Filter("InvoiceDate", "GE", oView.byId("invoiceDateRangesync").getFrom()));
                  aFilter.push(new Filter("InvoiceDate", "LE", oView.byId("invoiceDateRangesync").getTo()));
              }
  
              //Invoice Id
              if (oView.byId("invoiceFreeSearchsync").getValue() !== "") {
                  aFilter.push(new Filter("InvoiceNumber", "Contains", oView.byId("invoiceFreeSearchsync").getValue()));
              }
  
              //Ticket No
              if (oView.byId("invoiceFreeFiscalSearchsync").getValue() !== "") {
                  aFilter.push(new Filter("FiscalYear", "Contains", oView.byId("invoiceFreeFiscalSearchsync").getValue()));
              }
  
        //Reference No
              if (oView.byId("invoiceFreeRefSearchsync").getValue() !== "") {
                  aFilter.push(new Filter("DocumentNumber", "Contains", oView.byId("invoiceFreeRefSearchsync").getValue()));
              }
  
              return aFilter;
  
          },
          onSyncToSAPPress: async function(oEvent){
            var sSelectedContexts = this.byId("invoiceTablesync").getTable().getSelectedContexts();
          var sInvoices = [];
          if(sSelectedContexts.length > 0){
            for(var i=0; i<sSelectedContexts.length; i++){
              if(sSelectedContexts[i].getModel().getProperty(sSelectedContexts[i].getPath()).DocumentNumber){
                sInvoices.push({
                  document: sSelectedContexts[i].getModel().getProperty(sSelectedContexts[i].getPath()).DocumentNumber,
                  invoice: sSelectedContexts[i].getModel().getProperty(sSelectedContexts[i].getPath()).InvoiceNumber,
                  fy: sSelectedContexts[i].getModel().getProperty(sSelectedContexts[i].getPath()).FiscalYear
                })
              }
            }
            var sResponse = await models.syncFailedInvoices(sInvoices);
          }else{
            MessageBox.error("Please select a row to Sync");
          }
        
          }
        }
      );
    }
  );
  