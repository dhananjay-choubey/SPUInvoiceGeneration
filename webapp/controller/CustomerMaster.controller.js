sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast", "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, JSONModel, Filter, FilterOperator, Spreadsheet, MessageToast, models) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.CustomerMaster",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter.getRoute("customer").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: function(oEvent){
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            this.getOwnerComponent().getRouter().navTo("login");
          }
          var oModel = new JSONModel({});
          this.getOwnerComponent().setModel(oModel, "CustomerDetailModel");
          this._getCustomers(); 
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
        }else{
          var oModel = new JSONModel({});
          this.getOwnerComponent().setModel(oModel, "CustomerDetailModel");
        }
        
        },
        onSearchCustomer: function(oEvent){
          var sValue = oEvent.getSource().getValue().trim();
          var oFilter1 = new Filter("branchcode",FilterOperator.Contains, sValue);
          var oFilter2 = new Filter("branchname",FilterOperator.Contains, sValue);
					
          var oBinding = this.byId("customerList").getBinding("items");
          var oFilter = new Filter([oFilter1,oFilter2]);
          oBinding.filter(oFilter);
        },
        createColumnConfig: function(){
          return [
            {
              label: 'Branch Code',
              property: 'branchcode',
              width: 25
            },
            {
              label: 'Branch Name',
              property: 'branchname',
              width: '35'
            },
            {
              label: 'Customer Adress',
              property: 'address',
              width: '25'
            },
            {
              label: 'Pin Code',
              property: 'pincode',
              width: '10'
            },
            {
              label: 'GSTN Number',
              property: 'gstinnum',
              width: '18'
            },
            {
              label: 'PAN',
              property: 'pannum',
              width: '18'
            },
            {
              label: 'Mobile Number',
              property: 'mobilenum',
              width: '25'
            },
            {
              label: 'Email ID',
              property: 'emailid',
              width: '25'
            },
            {
              label: 'Region Code',
              property: 'regioncode',
              width: '25'
            },
            {
              label: 'Region Description',
              property: 'regiondesc',
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
