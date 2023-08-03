sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter", "sap/ui/core/Fragment"],
  function (Controller, formatter, Fragment) {
    "use strict";

    return Controller.extend("com.ifb.invoicegenerator.controller.Users", {
      formatter: formatter,

      onInit: function () {},
      handleCreatePress : function () {

			if (!this.userDialog) {
				this.userDialog = this.loadFragment({
					name: "com.ifb.invoicegenerator.fragments.CreateUser"
				});
			} 
			this.userDialog.then(function(oDialog) {
				oDialog.open();
			});
		},
        onSubmitDialog: function(){

        },
        onCancelDialog: function(){
            this.byId("createUserDialog").close();
        }
    });
  }
);
