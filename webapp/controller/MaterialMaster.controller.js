sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
  "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, JSONModel, Filter, FilterOperator, Spreadsheet, MessageToast, models) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.MaterialMaster",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter.getRoute("material").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: function(oEvent){
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            this.getOwnerComponent().getRouter().navTo("login");
          }
          this._getMaterials();
          
        },
        _getMaterials: async function(){
          var sData = await models.getMaterials();
          var oModel = new JSONModel(sData);
			    this.getView().setModel(oModel, "MaterialModel");
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
          var oFilter1 = new Filter("materialcode",FilterOperator.Contains, sValue);
          var oFilter2 = new Filter("materialdesc",FilterOperator.Contains, sValue);
					
          var oBinding = this.byId("materialList").getBinding("items");
          var oFilter = new Filter([oFilter1,oFilter2]);
          oBinding.filter(oFilter);
        },
        createColumnConfig: function(){
          return [
            {
              label: 'Product ID',
              property: 'materialcode',
              width: 25
            },
            {
              label: 'Product Description',
              property: 'materialdesc',
              width: '35'
            },
            {
              label: 'Material Category',
              property: 'materialcat',
              width: '25'
            },
            {
              label: 'Category Hierarchy ID',
              property: 'categoryhierarchyid',
              width: '18'
            },
            {
              label: 'Tax Tariff Code',
              property: 'taxtariffcode',
              width: '10'
            },
            {
              label: 'Tax Type',
              property: 'taxtype',
              width: '18'
            },
            {
              label: 'Group Id',
              property: 'groupid',
              width: '18'
            },
            {
              label: 'UOM',
              property: 'uom',
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
