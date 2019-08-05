sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/odata/ODataModel",
	"ZANA_01/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, ResourceModel, ODataModel, models,JSONModel) {
	"use strict";

	return UIComponent.extend("ZANA_01.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			//this.getRouter().initialize();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set resource model
        	var i18nModel = new ResourceModel({
            	bundleName : "ZANA_01.i18n.i18n"
        	});
        	this.setModel(i18nModel, "i18n");
		}
	});
});