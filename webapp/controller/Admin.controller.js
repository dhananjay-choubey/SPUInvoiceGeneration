sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/m/MessageToast", "sap/ui/core/Fragment", "com/ifb/invoicegenerator/model/models"],
  function (Controller, formatter, MessageToast, Fragment, models) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Admin", {
      formatter: formatter,

      onInit: function () {
        // Get Router Info
        this.oRouter = this.getOwnerComponent().getRouter();
        // Calling _handleRouteMatched before UI Rendering
        this.oRouter.getRoute("admin").attachPatternMatched(this._handleRouteMatched, this);
      },
      _handleRouteMatched: async function (oEvent) {
        if(!this.getOwnerComponent().getModel("LoginDataModel")){
          if(localStorage.getItem("email") && localStorage.getItem("password")){
            await this._login(localStorage.getItem("email"), localStorage.getItem("password"));
          }else{
            this.getOwnerComponent().getRouter().navTo("login");
          }
        }
      },
      onMaterialPress: function (oEvent) {
        this.getOwnerComponent().getRouter().navTo("material");
      },
      onBranchUserPress: function () {
        this.getOwnerComponent().getRouter().navTo("customer");
      },
      onFranchiseePress: function () {
        this.getOwnerComponent().getRouter().navTo("vendor");
      },
      onAppUsersPress: function () {
        this.getOwnerComponent().getRouter().navTo("users");
      },
      onSyncInvoiceGenerationPress: function () {
        this.getOwnerComponent().getRouter().navTo("syncinvoice");
      },
      onMasterDataSyncPress: function (oEvent) {
        var oView = this.getView();
        // create value help dialog
        if (!this._pMasterDataSync) {
          this._pMasterDataSync = Fragment.load({
            id: oView.getId(),
            name: "com.ifb.invoicegenerator.fragments.SyncMD",
            controller: this,
          }).then(
            function (oValueHelpDialogMDSync) {
              oValueHelpDialogMDSync.addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
              );
              oView.addDependent(oValueHelpDialogMDSync);
              return oValueHelpDialogMDSync;
            }.bind(this)
          );
        }

        // open value help dialog
        this._pMasterDataSync.then(function (oValueHelpDialogMDSync) {
          oValueHelpDialogMDSync.open();
        });
      },
      _handleValueHelpMDSyncClose: async function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          await models.syncMasterData(oSelectedItem.getTitle());
        }
      },
      onSalesTransactionsPress: function(oEvent){
        this.getOwnerComponent().getRouter().navTo("invoices");
      },
      onFailedInvoicesToSAP: function(oEvent){
        this.getOwnerComponent().getRouter().navTo("failedinvoices");
      }
    });
  }
);
