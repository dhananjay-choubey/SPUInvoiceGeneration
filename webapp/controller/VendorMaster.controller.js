sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
  "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, JSONModel, Filter, FilterOperator, Spreadsheet, MessageToast, models) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.VendorMaster",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter.getRoute("vendor").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: async function(oEvent){
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            if(localStorage.getItem("email") && localStorage.getItem("password")){
              await this._login(localStorage.getItem("email"), localStorage.getItem("password"));
            }else{
              this.getOwnerComponent().getRouter().navTo("login");
            }
          }
          var oModel = new JSONModel({});
          this.getOwnerComponent().setModel(oModel, "VendorDetailModel");
          this._getVendors();
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
          var oFilter1 = new Filter("vendorcode",FilterOperator.Contains, sValue);
          var oFilter2 = new Filter("vendorname",FilterOperator.Contains, sValue);
					
          var oBinding = this.byId("vendorList").getBinding("items");
          var oFilter = new Filter([oFilter1,oFilter2]);
          oBinding.filter(oFilter);
        },
        createColumnConfig: function(){
          return [
            {
              label: 'Vendor Code',
              property: 'vendorcode',
              width: 25
            },
            {
              label: 'Vendor Name',
              property: 'vendorname',
              width: '35'
            },
            {
              label: 'Vendor Adress',
              property: 'address',
              width: '25'
            },
            {
              label: 'Branch Code',
              property: 'branchcode',
              width: '18'
            },
            {
              label: 'Branch Name',
              property: 'branchdesc',
              width: '10'
            },
            {
              label: 'GSTN',
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
              label: 'Pin Code',
              property: 'pincode',
              width: '25'
            },
            {
              label: 'GSTN Reg Type',
              property: 'gstinregtype',
              width: '25'
            },
            {
              label: 'GSTN Reg Type Desc',
              property: 'gstinregtypedesc',
              width: '25'
            },
            {
              label: 'Effective Date',
              property: 'effectivedate',
              width: '25'
            },
            {
              label: 'State',
              property: 'state',
              width: '25'
            },
            {
              label: 'Region Code',
              property: 'regioncode',
              width: '25'
            },
            {
              label: 'City',
              property: 'city',
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
