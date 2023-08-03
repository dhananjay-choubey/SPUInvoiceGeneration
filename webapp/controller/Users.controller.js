sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter", "sap/ui/core/Fragment"],
  function (Controller, formatter, Fragment) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Users", {
      formatter: formatter,

      onInit: function () {},
      handleCreatePress: function () {
        if (!this.userDialog) {
          this.userDialog = this.loadFragment({
            name: "com.ifb.invoicegenerator.fragments.CreateUser",
          });
        }
        this.userDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      onSubmitDialog: function () {},
      onCancelDialog: function () {
        this.byId("createUserDialog").close();
      },
      handleValueHelpUser: function (oEvent) {
        var oView = this.getView();
        this._sInputId = oEvent.getSource().getId();

        // create value help dialog
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "com.ifb.invoicegenerator.fragments.UsersSelectDialog",
            controller: this,
          }).then(function (oValueHelpDialog) {
            oView.addDependent(oValueHelpDialog);
            return oValueHelpDialog;
          });
        }

        // open value help dialog
        this._pValueHelpDialog.then(function (oValueHelpDialog) {
          oValueHelpDialog.open();
        });
      },
      _handleValueHelpUserSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
      },
      _handleValueHelpUserClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          var productInput = this.byId(this._sInputId);
          productInput.setValue(oSelectedItem.getTitle());
        }
        oEvent.getSource().getBinding("items").filter([]);
      },
      handleChangePassword: function () {
        if (!this.changePasswordDialog) {
          this.changePasswordDialog = this.loadFragment({
            name: "com.ifb.invoicegenerator.fragments.ChangePassword",
          });
        }
        this.changePasswordDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      onSubmitPasswordDialog: function () {},
      onCancelPasswordDialog: function () {
        this.byId("changePasswordrDialog").close();
      },
      onShowPassword: function (oEvent) {
        if (oEvent.getSource().getPressed()) {
          this.getView().byId("password").setType(sap.m.InputType.DEFAULT);
          this.getView()
            .byId("confirmPassword")
            .setType(sap.m.InputType.DEFAULT);
          oEvent.getSource().setText("Hide Password");
          oEvent.getSource().setIcon("sap-icon://hide");
          oEvent.getSource().setType(sap.m.ButtonType.Reject);
        } else {
          this.getView().byId("password").setType(sap.m.InputType.Password);
          this.getView()
            .byId("confirmPassword")
            .setType(sap.m.InputType.Password);
          oEvent.getSource().setText("Show Password");
          oEvent.getSource().setIcon("sap-icon://show");
          oEvent.getSource().setType(sap.m.ButtonType.Accept);
        }
      },
    });
  }
);
