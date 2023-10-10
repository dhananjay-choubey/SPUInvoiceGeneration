sap.ui.define(
  [
    "com/ifb/invoicegenerator/controller/BaseController",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "com/ifb/invoicegenerator/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
  ],
  function (Controller, formatter, Filter, Sorter, FilterOperator, models, JSONModel, MessageBox, MessageToast, Fragment) {
    "use strict";

    return Controller.extend(
      "com.ifb.invoicegenerator.controller.Users",
      {
        formatter: formatter,

        onInit: function () {
          // Get Router Info
          this.oRouter = this.getOwnerComponent().getRouter();
          // Calling _handleRouteMatched before UI Rendering
          this.oRouter.getRoute("users").attachPatternMatched(this._handleRouteMatched, this);
        },
        _handleRouteMatched: async function (oEvent) {
          if(!this.getOwnerComponent().getModel("LoginDataModel")){
            if(localStorage.getItem("email") && localStorage.getItem("password")){
              await this._login(localStorage.getItem("email"), localStorage.getItem("password"));
            }else{
              this.getOwnerComponent().getRouter().navTo("login");
            }
          }
          this.clearFilters();
          this.setTableData();

        },
        setTableData: async function(){

          var userData = await models.getUsers();
          if(userData){
            var oDataModel = new JSONModel(userData);
            var invoiceTable;
            invoiceTable = this.byId("invoiceTableuser");
            invoiceTable.setModel(oDataModel);
            invoiceTable.setTableBindingPath("/");
            invoiceTable.setRequestAtLeastFields("userid,firstname,lastname,refid,usertype,email,phnum,region_desc,regioncode,branchcode,isactive");
            invoiceTable.rebindTable();
          }else{
            MessageBox.error(response.messageString);
          }
        },
        onBeforeRebindTable: function (oEvt) {
          var aFilters = this.getFilters();
          var oBindingParams = oEvt.getParameter("bindingParams");
          var oEvtSorter = oEvt.getParameters().bindingParams.sorter[0];
          var oSorter;
          //bind filters
          oBindingParams.filters = aFilters;

          //bind sort //10/28
          if (oEvtSorter !== undefined) {
            oSorter = new Sorter(oEvtSorter.sPath, oEvtSorter.bDescending);
            oBindingParams.sorter = oSorter;
          } else {
            oSorter = new Sorter("userid", true);
            oBindingParams.sorter = oSorter;
          }
        },
        onSearch: function () {
          this.setTableData();
          this.getView().byId("invoiceTableuser").rebindTable();
        },
        onSort: function () {
          var oSmartTable = this.getView().byId("invoiceTableuser");
          if (oSmartTable) {
            oSmartTable.openPersonalisationDialog("Sort");
          }
        },
        clearFilters: function () {
          var oView = this.getView();
          //oView.byId("nameFreeSearch").setValue("");
          oView.byId("refFreeSearch").setValue("");
          oView.byId("userTypeSelectId").setSelectedKey("");
    
        },
        onClear: function (oEvent) {
          this.clearFilters();
          this.onSearch();
        },
        onReset: function () {
          var oView = this.getView();
          //oView.byId("nameFreeSearch").setValue("");
          oView.byId("refFreeSearch").setValue("");
          oView.byId("userTypeSelectId").setSelectedKey("");
        },
        getFilters: function(){

          var oView = this.getView();
          var aFilter = [];

          //clear unchosen filters
          var aFiltersVisible = this.getView().byId("filterbaruser").getAllFilterItems();
          for (var i = 0; i < aFiltersVisible.length; i++) {
            if (!aFiltersVisible[i].getVisibleInFilterBar()) {
              //for select/combo box
              if (aFiltersVisible[i].getProperty("name") === "userTypeLabel") {
                aFiltersVisible[i].getControl().setSelectedKey("");
                //for checkbox
              } else {
                aFiltersVisible[i].getControl().setValue("");
              }
            }
          }

          //Name
          // if (oView.byId("nameFreeSearch").getValue() !== "") {
          //   aFilter.push(new Filter("firstname", "Contains", oView.byId("nameFreeSearch").getValue()));
          //   //aFilter.push(new Filter("lastname", "Contains", oView.byId("nameFreeSearch").getValue()));
          // }

          //Reference Id
          if (oView.byId("refFreeSearch").getValue() !== "") {
            aFilter.push(new Filter("refid", "Contains", oView.byId("refFreeSearch").getValue()));
          }

          //User Type
          if (oView.byId("userTypeSelectId").getSelectedKey() !== "") {
              aFilter.push(new Filter("usertype", "EQ", oView.byId("userTypeSelectId").getSelectedKey()));
          }

          return aFilter;

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
            oEvent.getSource().getParent().getModel("createModel").setProperty("/region_desc", sVendor[0].regiondesc);
            oEvent.getSource().getParent().getModel("createModel").setProperty("/segment", "");
          }
     
          var sFinalData = oEvent.getSource().getParent().getModel("createModel").getData();
  
          const response = await models.createUser(sFinalData);
          if(response.messageCode == "S"){
            MessageToast.show(response.messageString);
            this.onSearch();
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
          this._itemData = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
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
            this.onSearch();
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
          this.onSearch();
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
          var selectedItem = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
          var that = this;
  
          if(selectedItem.isactive.toUpperCase() == "YES" || selectedItem.isactive.toUpperCase() == "X") {
            MessageBox.confirm("Do you want to decativate " + selectedItem.firstname + " " + selectedItem.lastname + "?", {
              title: "Confirm",
              onClose: async function(sAction){
                if(sAction == "OK"){
                  await models.deactivateUser(selectedItem.email);
                  that.onSearch();
                }
              },
              actions: [ sap.m.MessageBox.Action.OK,
                        sap.m.MessageBox.Action.CANCEL ], 
              emphasizedAction: sap.m.MessageBox.Action.OK,
              initialFocus: null
            });
          }
        }
      }
    );
  }
);
