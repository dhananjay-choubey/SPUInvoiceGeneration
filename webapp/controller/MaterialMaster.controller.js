sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"],
  function (Controller, formatter, JSONModel, Filter, FilterOperator, Spreadsheet, MessageToast) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.MaterialMaster",
      {
        formatter: formatter,

        onInit: function () {
          var dataModel = this.getOwnerComponent().getModel("localData");
			    this.getView().setModel(dataModel, "MaterialModel");
        },
        onListItemPress: function(oEvent){
          var sData = oEvent.getParameter("listItem").getBindingContext("MaterialModel").getObject();
          var oModel = new JSONModel(sData);
          this.getOwnerComponent().setModel(oModel, "MaterialDetailModel");
        },
        onMaterialUpdateFinished: function(oEvent){
        if(oEvent.getSource().getItems()){
          oEvent.getSource().setSelectedItem(oEvent.getSource().getItems()[0])
          var sData = oEvent.getSource().getItems()[0].getBindingContext("MaterialModel").getObject();
          var oModel = new JSONModel(sData);
          this.getOwnerComponent().setModel(oModel, "MaterialDetailModel");
        }
        
        },
        onSearchMaterial: function(oEvent){
          var sValue = oEvent.getSource().getValue().trim();
          var oFilter1 = new Filter("ProductId",FilterOperator.Contains, sValue);
          var oFilter2 = new Filter("ProductDescription",FilterOperator.Contains, sValue);
					
          var oBinding = this.byId("materialList").getBinding("items");
          var oFilter = new Filter([oFilter1,oFilter2]);
          oBinding.filter(oFilter);
        },
        createColumnConfig: function(){
          return [
            {
              label: 'Product ID',
              property: 'ProductId',
              width: 25
            },
            {
              label: 'Product Description',
              property: 'ProductDescription',
              width: '35'
            },
            {
              label: 'Material Category',
              property: 'MaterialCategory',
              width: '25'
            },
            {
              label: 'Category Hierarchy ID',
              property: 'CategoryHierarchyID',
              width: '18'
            },
            {
              label: 'Tax Tariff Code',
              property: 'TaxTariffCode',
              width: '10'
            },
            {
              label: 'Tax Type',
              property: 'TaxType',
              width: '18'
            },
            {
              label: 'Group Id',
              property: 'GroupId',
              width: '18'
            },
            {
              label: 'UOM',
              property: 'UOM',
              width: '10'
            }];
        },
        onMaterialExport: function(oEvent){
          var aCols, oBinding, oSettings, oSheet;

          oBinding = this.byId('materialList').getBinding('items');
          aCols = this.createColumnConfig();
    
          oSettings = {
            workbook: { columns: aCols },
            dataSource: oBinding,
            fileName: 'Material_Master_Export.xlsx'
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
