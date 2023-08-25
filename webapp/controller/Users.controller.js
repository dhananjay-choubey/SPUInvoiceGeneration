sap.ui.define(
  [
    "com/ifb/invoicegenerator/controller/BaseController",
    "../model/formatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "com/ifb/invoicegenerator/model/models",
    "sap/m/MessageBox"
  ],
  function (
    Controller,
    formatter,
    Fragment,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast,
    models,
    MessageBox
  ) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Users", {
      formatter: formatter,

      onInit: function () {

        // Get Router Info
        this.oRouter = this.getOwnerComponent().getRouter();
        // Calling _handleRouteMatched before UI Rendering
        this.oRouter
          .getRoute("users")
          .attachPatternMatched(this._handleRouteMatched, this);
        
      },
      _handleRouteMatched: function(oEvent){
        this._bindUserData();
      },
      _bindUserData: async function(){
        var userData = await models.getUsers();
        if(userData){
          var dataModel = new JSONModel(userData);
          this.getView().setModel(dataModel, "UserModel");
        }else{
          var dataModel = new JSONModel({});
          this.getView().setModel(dataModel, "UserModel");
        }
      },
      handleCreatePress: function () {
        if (!this.userDialog) {
          this.userDialog = this.loadFragment({
            name: "com.ifb.invoicegenerator.fragments.CreateUser",
          });
        }
        this.userDialog.then(
          function (oDialog) {
            oDialog.addStyleClass(
              this.getOwnerComponent().getContentDensityClass()
            );
            this.initializeCreateModel(oDialog);
            oDialog.open();
          }.bind(this)
        );
      },
      initializeCreateModel: function (sControl) {
        var sData = {
          usertype: "",
          firstname: "",
          lastname: "",
          userid: "",
          password: "",
          confirmpassword: "",
          refid: "",
          email: "",
          phnum: "",
          regioncode: "",
          region_desc: "",
          isActive: "",
          branchcode: "",
          branchdesc: "",
          segment: "",
        };
        var oModel = new JSONModel(sData);
        sControl.setModel(oModel, "createModel");
      },
      onSubmitDialog: function (oEvent) {

        var mailRegex =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        var sData = oEvent.getSource().getParent().getModel("createModel").getData();

          if(!sData.refid){
            MessageToast.show("Please select reference");
            return;
          }

          if(!sData.firstname){
            MessageToast.show("First Name is blank");
            return;
          }

          if(!sData.email || !mailRegex.test(sData.email)){
            MessageToast.show("Enter valid email Id");
            return;
          }

          if(!sData.phnum || sData.phnum.length != 10){
            MessageToast.show("Enter Valid Mobile Number");
            return;
          }

          if(!sData.password){
            MessageToast.show("Password is blank");
            return;
          }

          if(sData.password != sData.confirmpassword){
            MessageToast.show("Password mismatch");
            return;
          }

        if (this.byId("rbg3").getSelectedIndex() == 0) {
          oEvent.getSource().getParent().getModel("createModel").setProperty("/usertype", "C");
          var sCustomerData = this.getOwnerComponent().getModel("localData").getData().Customers;
          var sCustomer = sCustomerData.filter(function(item){
            return item.BranchCode == sData.refid;         
        })
          oEvent.getSource().getParent().getModel("createModel").setProperty("/region", "Kolkata");
          oEvent.getSource().getParent().getModel("createModel").setProperty("/branchdesc", "Test");
          oEvent.getSource().getParent().getModel("createModel").setProperty("/segment", "1234");
        }else{
          oEvent.getSource().getParent().getModel("createModel").setProperty("/usertype", "V");
          var sVendorData =  this.getOwnerComponent().getModel("localData").getData().Vendors;
          var sVendor = sVendorData.filter(function(item){
            return item.VendorCode == sData.refid;         
        })
          oEvent.getSource().getParent().getModel("createModel").setProperty("/region", "Kolkata");
          oEvent.getSource().getParent().getModel("createModel").setProperty("/branchdesc", "Test");
          oEvent.getSource().getParent().getModel("createModel").setProperty("/segment", "1234");
        }

        
        var sFinalData = oEvent.getSource().getParent().getModel("createModel").getData();

        var sUserData = this.getView().getModel("UserModel").getData();
        sUserData.Users.push(sFinalData);

        var oModel = new JSONModel(sUserData);

        this.getView().setModel(oModel, "UserModel");




        this.byId("createUserDialog").close();
      },
      onCancelDialog: function () {
        this.byId("createUserDialog").close();
      },
      handleValueHelpUser: function (oEvent) {
        var oView = this.getView();
        this._sInputId = oEvent.getSource().getId();
        if (this.byId("rbg3").getSelectedIndex() == 0) {
          // create value help dialog for Customer
          if (!this._pValueHelpDialogCustomer) {
            this._pValueHelpDialogCustomer = Fragment.load({
              id: oView.getId(),
              name: "com.ifb.invoicegenerator.fragments.CustomerSelectDialog",
              controller: this,
            }).then(
              async function (oValueHelpDialogCustomer) {
                oValueHelpDialogCustomer.addStyleClass(
                  this.getOwnerComponent().getContentDensityClass()
                );
                oView.addDependent(oValueHelpDialogCustomer);
                var dataModel = await models.getVendorCustomerList("C");
                this.getView().setModel(dataModel, "CustomerF4Model");
                return oValueHelpDialogCustomer;
              }.bind(this)
            );
          }

          // open value help dialog
          this._pValueHelpDialogCustomer.then(function (
            oValueHelpDialogCustomer
          ) {
            oValueHelpDialogCustomer.open();
          });
        } else {
          // create value help dialog Vendor
          if (!this._pValueHelpDialogVendor) {
            this._pValueHelpDialogVendor = Fragment.load({
              id: oView.getId(),
              name: "com.ifb.invoicegenerator.fragments.VendorSelectDialog",
              controller: this,
            }).then(
              async function (oValueHelpDialogVendor) {
                oValueHelpDialogVendor.addStyleClass(
                  this.getOwnerComponent().getContentDensityClass()
                );
                oView.addDependent(oValueHelpDialogVendor);
                var dataModel = await models.getVendorCustomerList("V");
                this.getView().setModel(dataModel, "VendorF4Model");
                return oValueHelpDialogVendor;
              }.bind(this)
            );
          }

          // open value help dialog
          this._pValueHelpDialogVendor.then(function (oValueHelpDialogVendor) {
            oValueHelpDialogVendor.open();
          });
        }
      },
      _handleValueHelpCustomerSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value").trim();
        var oFilter1 = new Filter(
          "BranchCode",
          FilterOperator.Contains,
          sValue
        );
        var oFilter2 = new Filter(
          "BranchName",
          FilterOperator.Contains,
          sValue
        );

        var oBinding = oEvent.getParameter("itemsBinding");
        var oFilter = new Filter([oFilter1, oFilter2]);
        oBinding.filter(oFilter);
      },
      _handleValueHelpCustomerClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          var customerInput = this.byId(this._sInputId);
          customerInput.setValue(oSelectedItem.getDescription());
        }
        oEvent.getSource().getBinding("items").filter([]);
      },
      _handleValueHelpVendorSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value").trim();
        var oFilter1 = new Filter(
          "VendorCode",
          FilterOperator.Contains,
          sValue
        );
        var oFilter2 = new Filter(
          "VendorName",
          FilterOperator.Contains,
          sValue
        );

        var oBinding = oEvent.getParameter("itemsBinding");
        var oFilter = new Filter([oFilter1, oFilter2]);
        oBinding.filter(oFilter);
      },
      _handleValueHelpVendorClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          var vendorInput = this.byId(this._sInputId);
          vendorInput.setValue(oSelectedItem.getDescription());
        }
        oEvent.getSource().getBinding("items").filter([]);
      },
      handleChangePassword: function (oEvent) {
        this._itemData = oEvent.getSource().getParent().getBindingContext("UserModel").getObject();
        if (!this.changePasswordDialog) {
          this.changePasswordDialog = this.loadFragment({
            name: "com.ifb.invoicegenerator.fragments.ChangePassword",
          });
        }
        this.changePasswordDialog.then(
          function (oDialog) {
            oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
            var oModel = new JSONModel(this._itemData);
            oDialog.setModel(oModel, "itemModel");
            oDialog.open();
          }.bind(this)
        );
      },
      onSubmitPasswordDialog: async function () {
        if(this.byId("password").getValue()){
          await models.changePassword(this._itemData.email, this._itemData.password);
          this._bindUserData();
        }else{
          MessageToast.show("Password should not be blank.");
        }
        this.byId("changePasswordrDialog").close();
        this.byId("showPassword").setText("Show Password");
        this.byId("showPassword").setIcon("sap-icon://show");
        this.byId("showPassword").setType(sap.m.ButtonType.Accept);
        this.byId("password").setType(sap.m.InputType.Password);
      },
      onCancelPasswordDialog: function () {
        this._bindUserData();
        this.byId("changePasswordrDialog").close();
        this.byId("showPassword").setText("Show Password");
        this.byId("showPassword").setIcon("sap-icon://show");
        this.byId("showPassword").setType(sap.m.ButtonType.Accept);
        this.byId("password").setType(sap.m.InputType.Password);
      },
      onShowPassword: function (oEvent) {
        if (oEvent.getSource().getPressed()) {
          this.getView().byId("password").setType(sap.m.InputType.DEFAULT);
          oEvent.getSource().setText("Hide Password");
          oEvent.getSource().setIcon("sap-icon://hide");
          oEvent.getSource().setType(sap.m.ButtonType.Reject);
        } else {
          this.getView().byId("password").setType(sap.m.InputType.Password);
          oEvent.getSource().setText("Show Password");
          oEvent.getSource().setIcon("sap-icon://show");
          oEvent.getSource().setType(sap.m.ButtonType.Accept);
        }
      },
      onRBGSelect: function(oEvent){
        this.initializeCreateModel(this.getView().byId("createUserDialog"));
      },
      handleDeactivateUser: function(oEvent){
        var selectedItem = oEvent.getSource().getParent().getBindingContext("UserModel").getObject();
        var that = this;

        if(selectedItem.isActive.toUpperCase() == "YES" || selectedItem.isActive.toUpperCase() == "X") {
          MessageBox.confirm("Do you want to decativate " + selectedItem.firstname + " " + selectedItem.lastname + "?", {
            title: "Confirm",
            onClose: async function(sAction){
              if(sAction == "OK"){
                await models.deactivateUser(selectedItem.email);
                that._bindUserData();
              }
            },
            actions: [ sap.m.MessageBox.Action.OK,
                      sap.m.MessageBox.Action.CANCEL ], 
            emphasizedAction: sap.m.MessageBox.Action.OK,
            initialFocus: null
          });
        }
      }
    });
  }
);
