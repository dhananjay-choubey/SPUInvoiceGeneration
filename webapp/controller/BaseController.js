sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"com/ifb/invoicegenerator/model/models",
	"sap/ui/core/routing/History"
], function (Controller, formatter, JSONModel, models, History) {
	"use strict";
	return Controller.extend("com.ifb.invoicegenerator.controller.BaseController", {
		formatter: formatter,
        onLogoffPress: function(oEvent){
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          this.getOwnerComponent().getRouter().navTo("login");
        },
        _getCustomers: async function(){
          var sBranchCode;
          var oModel;
          var sLoginModel = this.getOwnerComponent().getModel("LoginDataModel");
          if(sLoginModel.getProperty("/usertype") == "V"){
            sBranchCode = sLoginModel.getProperty("/branchcode")
          }
          var sData = await models.getCustomerList(sBranchCode);
          oModel = new JSONModel(sData);
          this.getOwnerComponent().setModel(oModel, "CustomerModel");
          var oModel1 = new JSONModel({});
          this.getOwnerComponent().setModel(oModel1, "CustomerDetailModel");
          
        },
        _getMaterials: async function(){
          var sData = await models.getMaterials();
          var oModel = new JSONModel(sData);
		      this.getOwnerComponent().setModel(oModel, "MaterialModel");
          var oModel1 = new JSONModel({});
          this.getOwnerComponent().setModel(oModel1, "MaterialDetailModel");
        },
        _getVendors: async function(){
          var sBranchCode, sVendorCode;
          var sLoginModel = this.getOwnerComponent().getModel("LoginDataModel");
          if(sLoginModel.getProperty("/usertype") == "V"){
            sVendorCode = sLoginModel.getProperty("/refid")
          }else if(sLoginModel.getProperty("/usertype") == "C"){
            sBranchCode = sLoginModel.getProperty("/refid")
          }
          var sData = await models.getVendorList(sBranchCode, sVendorCode);
          var oModel = new JSONModel(sData);
			    this.getOwnerComponent().setModel(oModel, "VendorModel");
          var oModel1 = new JSONModel({});
          this.getOwnerComponent().setModel(oModel, "VendorDetailModel");
        },

        onNavBack: function () {
          var oHistory = History.getInstance();
          var sPreviousHash = oHistory.getPreviousHash();
    
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            var sLoginModel = this.getOwnerComponent().getModel("LoginDataModel");
            var oRouter = this.getOwnerComponent().getRouter();
            if(sLoginModel){
              oRouter.navTo("admin", {}, true);
            }else{
              oRouter.navTo("login", {}, true);
            }
            
            
          }
        }
	});
});