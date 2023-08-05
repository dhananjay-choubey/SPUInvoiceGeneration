sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"],
  function (Controller, formatter, JSONModel, Filter, FilterOperator, Spreadsheet, MessageToast) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.VendorMaster",
      {
        formatter: formatter,

        onInit: function () {
          var dataModel = this.getOwnerComponent().getModel("localData");
			    this.getView().setModel(dataModel, "VendorModel");
        },
        onListItemPress: function(oEvent){
          var sData = oEvent.getParameter("listItem").getBindingContext("VendorModel").getObject();
          var oModel = new JSONModel(sData);
          this.getOwnerComponent().setModel(oModel, "VendorDetailModel");
        },
        onVendorUpdateFinished: function(oEvent){
        if(oEvent.getSource().getItems()){
          oEvent.getSource().setSelectedItem(oEvent.getSource().getItems()[0])
          var sData = oEvent.getSource().getItems()[0].getBindingContext("VendorModel").getObject();
          var oModel = new JSONModel(sData);
          this.getOwnerComponent().setModel(oModel, "VendorDetailModel");
        }
        
        },
        onSearchVendor: function(oEvent){
          var sValue = oEvent.getSource().getValue().trim();
          var oFilter1 = new Filter("VendorCode",FilterOperator.Contains, sValue);
          var oFilter2 = new Filter("VendorName",FilterOperator.Contains, sValue);
					
          var oBinding = this.byId("vendorList").getBinding("items");
          var oFilter = new Filter([oFilter1,oFilter2]);
          oBinding.filter(oFilter);
        },
        createColumnConfig: function(){
          return [
            {
              label: 'Vendor Code',
              property: 'VendorCode',
              width: 25
            },
            {
              label: 'Vendor Name',
              property: 'VendorName',
              width: '35'
            },
            {
              label: 'Vendor Adress',
              property: 'VendorAdress',
              width: '25'
            },
            {
              label: 'Branch Code',
              property: 'BranchCode',
              width: '18'
            },
            {
              label: 'Branch Name',
              property: 'BranchName',
              width: '10'
            },
            {
              label: 'GSTN',
              property: 'GSTN',
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
              property: 'EmailID',
              width: '25'
            },
            {
              label: 'Pin Code',
              property: 'PinCode',
              width: '25'
            },
            {
              label: 'GSTN Reg Type',
              property: 'GSTNRegType',
              width: '25'
            },
            {
              label: 'Effective Date',
              property: 'EffectiveDate',
              width: '25'
            },
            {
              label: 'State',
              property: 'State',
              width: '25'
            },
            {
              label: 'Region Code',
              property: 'RegionCode',
              width: '25'
            },
            {
              label: 'City',
              property: 'City',
              width: '25'
            }];
        },
        onVendorExport: function(oEvent){
          var aCols, oBinding, oSettings, oSheet;

          oBinding = this.byId('vendorList').getBinding('items');
          aCols = this.createColumnConfig();
    
          oSettings = {
            workbook: { columns: aCols },
            dataSource: oBinding,
            fileName: 'Vendor_Master_Export.xlsx'
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
