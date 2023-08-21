sap.ui.define(
  ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/m/MessageToast", "sap/ui/core/Fragment"],
  function (Controller, formatter, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Admin", {
      formatter: formatter,

      onInit: function () {
        //First do the backend call to validate the user
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("admin").attachMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (oEvent) {
        console.log("onROuteMatched triggered");
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
      _handleValueHelpMDSyncClose: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        if (oSelectedItem) {
          MessageToast.show(oSelectedItem.getTitle() + " Sync is in progress.");
        }
      },
      onSalesTransactionsPress: function(oEvent){
        this.getOwnerComponent().getRouter().navTo("invoices");
      }
    });
  }
);
