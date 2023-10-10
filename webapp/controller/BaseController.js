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
          location.replace(location.href.split("#")[0]);
          //this.getOwnerComponent().getRouter().navTo("login");
        },
        _getCustomers: async function(){
          var sBranchCode, sRegionCode;
          var oModel;
          var sLoginModel = this.getOwnerComponent().getModel("LoginDataModel");
          if(sLoginModel.getProperty("/usertype") == "V"){
            sBranchCode = sLoginModel.getProperty("/branchcode");
          }else if(sLoginModel.getProperty("/usertype") == "C"){
            sRegionCode = sLoginModel.getProperty("/regioncode");
          }

          var sData = await models.getCustomerList(sBranchCode, sRegionCode);
          
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
        },
        _login: async function (sEmail, sPassword, dashboardFlag){
          const loginData = await models.login(sEmail, sPassword);
          if(loginData){
            var loginDataModel = new JSONModel(loginData);
            this.getOwnerComponent().setModel(loginDataModel, "LoginDataModel");
            if(dashboardFlag == "X"){
              this.getOwnerComponent().getRouter().navTo("admin");
            }
            
          }else{
            MessageToast.show("Please enter valid credentials");
          }
        },
	});
});