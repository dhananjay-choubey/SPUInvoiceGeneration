sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/m/MessageToast", "sap/ui/model/json/JSONModel", "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, MessageToast, JSONModel, models) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Login", {
      formatter: formatter,

      onInit: function () {
        // Get Router Info
        this.oRouter = this.getOwnerComponent().getRouter();
        // Calling _handleRouteMatched before UI Rendering
        this.oRouter.getRoute("login").attachPatternMatched(this._handleRouteMatched, this);
      },
      _handleRouteMatched: async function(oEvent){
        if(localStorage.getItem("email") && localStorage.getItem("password")){
          await this._login(localStorage.getItem("email"), localStorage.getItem("password"), "X");
        }
      },
      onLoginPressed: async function (oEvent) {
        if (!this.byId("loginEmailId").getValue()) {
          this.byId("loginEmailId").setValueState("Error");
          this.byId("loginEmailId").setValueStateText("Email Id is blank");
          return;
        }
        if (!this.byId("loginPassword").getValue()) {
          this.byId("loginPassword").setValueState("Error");
          this.byId("loginPassword").setValueStateText("Password is blank");
          return;
        }
        var mailRegex =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (
          this.byId("loginEmailId").getValue() &&
          this.byId("loginPassword").getValue() &&
          mailRegex.test(this.byId("loginEmailId").getValue())
        ) {
          //if(this.byId("keepMeLoggedInId").getSelected()){
            localStorage.setItem("email" , this.byId("loginEmailId").getValue());
            localStorage.setItem("password" , this.byId("loginPassword").getValue());
          //}

          this._login(this.byId("loginEmailId").getValue(), this.byId("loginPassword").getValue(), "X");

          this.byId("loginEmailId").setValue("");
          this.byId("loginPassword").setValue("");
          this.byId("loginEmailId").setValueState("None");
          this.byId("loginPassword").setValueState("None");
          this.byId("loginEmailId").setValueStateText("");
          this.byId("loginPassword").setValueStateText("");

        } else {
          MessageToast.show("Plese provide valid email and password");
        }
      },
      onLiveEmailChange: function (oEvent) {
        var mailRegex =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!mailRegex.test(oEvent.getSource().getValue())) {
          oEvent.getSource().setValueState("Error");
          oEvent.getSource().setValueStateText("Enter valid email id");
          return;
        } else {
          oEvent.getSource().setValueState("Success");
          oEvent.getSource().setValueStateText("");
        }
      },
      onPasswordLiveChange: function (oEvent) {
        if (oEvent.getSource().getValue().length > 0) {
          oEvent.getSource().setValueState("Success");
          oEvent.getSource().setValueStateText("");
        }
      },
      onForgotPasswordClicked: async function(oEvent){
        var oResponse = await models.getAdminUserDetails();
        if(oResponse && oResponse[0].email){
          window.location.href = "mailto:"+oResponse[0].email+"?subject=Request for password reset&body=";
        }
      },
      onDigitalSignPress: async function(oEvent){
        const response = await models.callDIgitalSignApi();
        if(response){
          await models.callEMSignerGateway(response);
        }
      }
    });
  }
);
