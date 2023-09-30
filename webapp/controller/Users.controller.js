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
        if(!this.getOwnerComponent().getModel("LoginDataModel")){
          this.getOwnerComponent().getRouter().navTo("login");
        }
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
          isactive: "",
          branchcode: ""
        };
        var oModel = new JSONModel(sData);
        sControl.setModel(oModel, "createModel");
      },
      onSubmitDialog: async function (oEvent) {

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
          var sCustomer = this._customerlist.filter(function(item){
            return item.branchcode == sData.refid;         
          })
          oEvent.getSource().getParent().getModel("createModel").setProperty("/branchcode", "");
          oEvent.getSource().getParent().getModel("createModel").setProperty("/isactive", "X");
          oEvent.getSource().getParent().getModel("createModel").setProperty("/regioncode", sCustomer[0].regioncode);
          oEvent.getSource().getParent().getModel("createModel").setProperty("/region_desc", sCustomer[0].regiondesc);
          oEvent.getSource().getParent().getModel("createModel").setProperty("/segment", sCustomer[0].segment);

        }else{
          oEvent.getSource().getParent().getModel("createModel").setProperty("/usertype", "V");
          var sVendor = this._vendorList.filter(function(item){
            return item.vendorcode == sData.refid;         
          })
          oEvent.getSource().getParent().getModel("createModel").setProperty("/branchcode", sVendor[0].branchcode);
          oEvent.getSource().getParent().getModel("createModel").setProperty("/isactive", "X");
          oEvent.getSource().getParent().getModel("createModel").setProperty("/regioncode", sVendor[0].regioncode);
          //This needs to be changed based on logiv of Vendor Desc provided by client
          oEvent.getSource().getParent().getModel("createModel").setProperty("/region_desc", sVendor[0].state);
          oEvent.getSource().getParent().getModel("createModel").setProperty("/segment", "");
        }
   
        var sFinalData = oEvent.getSource().getParent().getModel("createModel").getData();

        const response = await models.createUser(sFinalData);
        if(response.messageCode == "S"){
          MessageToast.show(response.messageString);
          this._bindUserData();
          this.byId("createUserDialog").close();
        }else {
          MessageBox.error(response.messageString);
        }

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
                this._customerlist = await models.getCustomerList();
                var oModel = new JSONModel(this._customerlist);
                this.getView().setModel(oModel, "CustomerF4Model");
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
                this._vendorList = await models.getVendorList();
                var oModel = new JSONModel(this._vendorList);
                this.getView().setModel(oModel, "VendorF4Model");
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
          "branchcode",
          FilterOperator.Contains,
          sValue
        );
        var oFilter2 = new Filter(
          "branchname",
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
          "vendorcode",
          FilterOperator.Contains,
          sValue
        );
        var oFilter2 = new Filter(
          "vendorname",
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

        if(selectedItem.isactive.toUpperCase() == "YES" || selectedItem.isactive.toUpperCase() == "X") {
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
