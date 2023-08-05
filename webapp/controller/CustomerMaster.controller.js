sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"],
  function (Controller, formatter, JSONModel, Filter, FilterOperator, Spreadsheet, MessageToast) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.CustomerMaster",
      {
        formatter: formatter,

        onInit: function () {
          var dataModel = this.getOwnerComponent().getModel("localData");
			    this.getView().setModel(dataModel, "CustomerModel");
        },
        onListItemPress: function(oEvent){
          var sData = oEvent.getParameter("listItem").getBindingContext("CustomerModel").getObject();
          var oModel = new JSONModel(sData);
          this.getOwnerComponent().setModel(oModel, "CustomerDetailModel");
        },
        onCustomerUpdateFinished: function(oEvent){
        if(oEvent.getSource().getItems()){
          oEvent.getSource().setSelectedItem(oEvent.getSource().getItems()[0])
          var sData = oEvent.getSource().getItems()[0].getBindingContext("CustomerModel").getObject();
          var oModel = new JSONModel(sData);
          this.getOwnerComponent().setModel(oModel, "CustomerDetailModel");
        }
        
        },
        onSearchCustomer: function(oEvent){
          var sValue = oEvent.getSource().getValue().trim();
          var oFilter1 = new Filter("BranchCode",FilterOperator.Contains, sValue);
          var oFilter2 = new Filter("BranchName",FilterOperator.Contains, sValue);
					
          var oBinding = this.byId("customerList").getBinding("items");
          var oFilter = new Filter([oFilter1,oFilter2]);
          oBinding.filter(oFilter);
        },
        createColumnConfig: function(){
          return [
            {
              label: 'Branch Code',
              property: 'BranchCode',
              width: 25
            },
            {
              label: 'Branch Name',
              property: 'BranchName',
              width: '35'
            },
            {
              label: 'Customer Adress',
              property: 'Address',
              width: '25'
            },
            {
              label: 'Pin Code',
              property: 'PinCode',
              width: '10'
            },
            {
              label: 'GSTN Number',
              property: 'GSTNNumber',
              width: '18'
            },
            {
              label: 'PAN',
              property: 'PAN',
              width: '18'
            },
            {
              label: 'Mobile Number',
              property: 'MobileNumber',
              width: '25'
            },
            {
              label: 'Email ID',
              property: 'EmailId',
              width: '25'
            },
            {
              label: 'Region Code',
              property: 'RegionCode',
              width: '25'
            },
            {
              label: 'Region Description',
              property: 'RegionDesc',
              width: '25'
            }];
        },
        onCustomerExport: function(oEvent){
          var aCols, oBinding, oSettings, oSheet;

          oBinding = this.byId('customerList').getBinding('items');
          aCols = this.createColumnConfig();
    
          oSettings = {
            workbook: { columns: aCols },
            dataSource: oBinding,
            fileName: 'Customer_Master_Export.xlsx'
          };
    
          oSheet = new Spreadsheet(oSettings);
          oSheet.build()
            .then(function() {
              MessageToast.show('Spreadsheet export has finished');
            }).finally(function() {
              oSheet.destroy();
            });
        }
      }
    );
  }
);
