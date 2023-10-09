sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.ifb.invoicegenerator.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			this.baseURL = "http://192.168.52.172/api/";
			//this.baseURL = "http://192.168.52.174/api/";
			models.constructor(this);
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
			this.getRootControl().addStyleClass(this.getContentDensityClass());
		},
		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
			  if (Device.support.touch) {
				this._sContentDensityClass = "sapUiSizeCozy";
			  } else {
				this._sContentDensityClass = "sapUiSizeCompact";
			  }
			}
			return this._sContentDensityClass;
		  }
	});
});