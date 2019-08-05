sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"ZANA_01/controls/LineChart",
	//"ZANA_01/controls/LineChartItem",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
	"sap/m/MessageToast",
	"ZANA_01/libs/lodash"
], function(Controller, History, LineChart, JSONModel, Filter, MessageToast, lodash) {
	"use strict";
	/*****Variable Declarations********/
	var oModel;
	return Controller.extend("ZANA_01.controller.AnaesthesiaView", {

		/*******Helper Methods************/
		generateID: function(id) {

		},
		getDialog: function(data) {
			var that = this;
			if (!this._dialog) {
				this._dialog = sap.ui.xmlfragment("Dialog", "ZANA_01.view.fragment.vitalData", this);
			}
			var i18nModel = this.getView().getModel("i18n");
			this._dialog.setModel(i18nModel, "i18n");
			this.vitalDataTable = sap.ui.core.Fragment.byId("Dialog", "vitalTable");
			var vitalModel = sap.ui.getCore().getModel("vitalDataModel");
			
			if (data.length > 0) {
				this.vitalDataTable.removeAllItems(); //removes all items from the table
				/*Add Data*/
				for (let i = 0; i < data.length; i++) {
					let dt = new Date(data[i].date);
					var oSingleListEntry = new sap.m.ColumnListItem({
						//type: "Navigation",
						tap: function(oEvent) {

						}
					});
					oSingleListEntry.addCell(new sap.m.CheckBox({

					}));
					oSingleListEntry.addCell(new sap.m.Label({
						text: data[i].date,
						design: "Bold"
					}));
					oSingleListEntry.addCell(new sap.m.Label({
						text: dt.getDate() < 10 ? "0" + dt.getDate() + ":00" : dt.getDate() + ":00",
						design: "Bold"
					}));
					oSingleListEntry.addCell(new sap.m.Label({
						text: data[i].vitalName,
						design: "Bold"
					}));
					oSingleListEntry.addCell(new sap.m.Input({
						enabled: data[i].editEnabled,
						value: data[i].value.toFixed(2),
						design: "Bold"
					}));
					oSingleListEntry.addCell(new sap.m.Label({
						text: data[i].uom,
						design: "Bold"
					}));
					this.vitalDataTable.addItem(oSingleListEntry);

				}
			}
			return this._dialog;
		},
		getAssociationDialog: function() {
			var that = this;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("Dialog", "ZANA_01.view.fragment.associateDevice", this);
			}
			this.getView().addDependent(this._oDialog);
			return this._oDialog;
		},
		hideBusyIndicator: function() {
			sap.ui.core.BusyIndicator.hide();
		},
		showBusyIndicator: function() {
			sap.ui.core.BusyIndicator.show();
		},
		/*******Default API Methods *****/
		onInit: function() {
			var oModel = this.getOwnerComponent().getModel();
			this.getView().setModel(oModel);
			this._oDialog;
			this.chartList;
			this.chartData = [];
			this.onDialogClick = false;
			this.editClicked = false;

			//this.mockModel = new JSONModel(sap.ui.require.toUrl("ZANA_01/mockdata") + "/chart.json");
			//this.getView().setModel("chartModel", this.mockModel);
		},
		onBeforeRendering: function() {

		},
		onAfterRendering: function() {
			if (!this.onDialogClick) {
				let data = this._mockGenerateData();
				this.chartData = data;
				this._loadVitalList(data);
			}

		},
		onExit: function() {

		},
		/***********Dummy Functions*************/
		_mockGenerateData: function() {
			let _array = [];
			_array.push({
				"ParentID": "Chart1Container",
				"ChartID": "Chart1ID",
				"VitalID": "Vital1",
				"displayID": "Test1",
				"VitalName": "Heart Rate",
				"VitalLow": "60",
				"VitalHigh": "100",
				"uom": "bpm",
				"SubVitals": ""
			});
			_array.push({
				"ParentID": "Chart2Container",
				"ChartID": "Chart2ID",
				"VitalID": "Vital2",
				"displayID": "Test2",
				"VitalName": "Respiratory Rate",
				"VitalLow": "12",
				"VitalHigh": "20",
				"uom": "bpm",
				"SubVitals": ""
			});
			_array.push({
				"ParentID": "Chart3Container",
				"ChartID": "Chart3ID",
				"VitalID": "Vital3",
				"displayID": "Test3",
				"VitalName": "SpO2",
				"VitalLow": "85",
				"VitalHigh": "100",
				"uom": "%",
				"SubVitals": ""
			});
			_array.push({
				"ParentID": "Chart4Container",
				"ChartID": "Chart4ID",
				"VitalID": "Vital4",
				"displayID": "Test4",
				"VitalName": "Blood Pressure",
				"VitalLow": "100",
				"VitalHigh": "140",
				"uom": "mmHg",
				"SubVitals": "Systolic,Diastolic,Ass. Systolic,Ass. Diastolic"
			});
			_array.push({
				"ParentID": "Chart5Container",
				"ChartID": "Chart5ID",
				"VitalID": "Vital5",
				"displayID": "Test5",
				"VitalName": "Temperature",
				"VitalLow": "35.9",
				"VitalHigh": "37.4",
				"uom": "°C",
				"SubVitals": "Skin,Axila,Oral"
			});
			_array.push({
				"ParentID": "Chart6Container",
				"ChartID": "Chart6ID",
				"VitalID": "Vital6",
				"displayID": "Test6",
				"VitalName": "End Tidal CO2",
				"VitalLow": "35",
				"VitalHigh": "45",
				"uom": "mmHg",
				"SubVitals": ""
			});
			_array.push({
				"ParentID": "Chart7Container",
				"ChartID": "Chart7ID",
				"VitalID": "Vital7",
				"displayID": "Test7",
				"VitalName": "CO",
				"VitalLow": "4.01",
				"VitalHigh": "8.5",
				"uom": "l/min",
				"SubVitals": ""
			});
			_array.push({
				"ParentID": "Chart8Container",
				"ChartID": "Chart8ID",
				"VitalID": "Vital8",
				"displayID": "Test8",
				"VitalName": "SPHb",
				"VitalLow": "7",
				"VitalHigh": "17",
				"uom": "gm/dl",
				"SubVitals": ""
			});
			return _array;
		},
		_getRandomArbitrary: function(min, max) {
			return Math.random() * (max - min) + min;
		},
		_generateMockChart: function(vitalName) {
			let _arr = [];
			let self = this;
			let min = 0,
				max = 0;
			let dateArray = ["2019-01-01", "2019-01-02", "2019-01-03", "2019-01-04", "2019-01-05", "2019-01-06", "2019-01-07", "2019-01-08",
				"2019-01-09", "2019-01-10", "2019-01-11", "2019-01-12", "2019-01-13", "2019-01-14", "2019-01-15", "2019-01-16", "2019-01-17",
				"2019-01-18",
				"2019-01-19", "2019-01-20", "2019-01-21", "2019-01-22", "2019-01-23"
			];
			let subVital = _.map(this.chartData, function(o) {
				if (o.VitalID.toString().toLowerCase().indexOf(vitalName.toString().toLowerCase()) >= 0) return o;
			});
			subVital = _.without(subVital, undefined);
			min = Number(subVital[0].VitalLow);
			max = Number(subVital[0].VitalHigh);
			let subVitals = subVital[0].SubVitals != "" ? subVital[0].SubVitals.split(',') : [];
			if (subVitals.length > 0) {
				if (vitalName == "Vital4") {
					for (let i = 0; i < dateArray.length; i++) {
						_arr.push({
							"date": dateArray[i],
							"value": self._getRandomArbitrary(min, max),
							"value1": self._getRandomArbitrary(min, max),
							"value2": self._getRandomArbitrary(min, max),
							"value3": self._getRandomArbitrary(min, max)
						});
					}
				} else {
					for (let i = 0; i < dateArray.length; i++) {
						_arr.push({
							"date": dateArray[i],
							"value": self._getRandomArbitrary(min, max),
							"value1": self._getRandomArbitrary(min, max),
							"value2": self._getRandomArbitrary(min, max)
						});
					}
				}

			} else {
				for (let i = 0; i < dateArray.length; i++) {
					_arr.push({
						"date": dateArray[i],
						"value": self._getRandomArbitrary(min, max)

					});
				}
			}
			console.log(_arr);
			return _arr;
		},
		_generateTableMockData: function(vitalID) {
			let _arr = [];
			let self = this;
			let min = 0,
				max = 0;
			let dateArray = ["2019-01-01", "2019-01-02", "2019-01-03", "2019-01-04", "2019-01-05", "2019-01-06", "2019-01-07", "2019-01-08",
				"2019-01-09", "2019-01-10", "2019-01-11", "2019-01-12", "2019-01-13", "2019-01-14", "2019-01-15", "2019-01-16", "2019-01-17",
				"2019-01-18",
				"2019-01-19", "2019-01-20", "2019-01-21", "2019-01-22", "2019-01-23"
			];
			let subVital = _.map(this.chartData, function(o) {
				if (o.VitalID.toString().toLowerCase().indexOf(vitalID.toString().toLowerCase()) >= 0) return o;
			});
			subVital = _.without(subVital, undefined);
			min = Number(subVital[0].VitalLow);
			max = Number(subVital[0].VitalHigh);

			for (let i = 0; i < dateArray.length; i++) {
				_arr.push({
					"vitalId": vitalID,
					"vitalName": subVital[0].VitalName,
					"date": dateArray[i],
					"uom": subVital[0].uom,
					"editEnabled": false,
					"value": self._getRandomArbitrary(min, max)

				});
			}
			return _arr;

		},
		/*********Screen Handler Events*********/
		/*@*************************************************************************************************
		@ - This function to be used to get all subvitals for the vital and plot the pills on the side panel
		****************************************************************************************************/
		_onDialogEditPress: function() {
			let that = this;
			if(that.editClicked != undefined) {
				that.editClicked = !that.editClicked;
			}
			else{
				that.editClicked = true;
			}
			this.vitalDataTable = sap.ui.core.Fragment.byId("Dialog", "vitalTable");
			this.vitalDataTable.getItems().map(function (oItem){
				if(that.editClicked != undefined)
				oItem.getCells()[4].setEnabled(that.editClicked);
				else
				oItem.getCells()[4].setEnabled(true);
				return oItem;//.getBindingContext().getObject();
			});
		},
		_associateDevice: function() {
			this.onDialogClick = true;
			this.getAssociationDialog().open();
		},
		_getSubVitalClass: function(param) {
			if (param == 0) {
				return "pinkPill pill";
			} else if (param == 1) {
				return "orangePill pill";
			} else if (param == 2) {
				return "greenPill pill";
			} else if (param == 3) {
				return "bluePill pill";
			} else if (param == 4) {
				return "magentaPill pill";
			}
		},
		_getSubVitals: function(vitalName) {
			console.log(vitalName);
			var oControl = new sap.m.List();
			let self = this;
			let subVital = _.map(this.chartData, function(o) {
				if (o.VitalID.toString().toLowerCase().indexOf(vitalName.toString().toLowerCase()) >= 0) return o;
			});
			subVital = _.without(subVital, undefined);
			if (subVital.length > 0 && subVital[0].SubVitals != "") {
				let subVitals = subVital[0].SubVitals.split(',');
				for (let i = 0; i < subVitals.length; i++) {
					let oControlItem = new sap.m.CustomListItem();
					oControlItem.addContent(new sap.m.Label({
						text: subVitals[i].toString()
					})).addStyleClass(self._getSubVitalClass(i));
					oControl.addItem(oControlItem);
				}
			} else {
				oControl.setVisible(false); //This property is set when the vitals has no subvitals	
				let oControlItem = new sap.m.CustomListItem();
				oControl.addItem(oControlItem);
			}
			return oControl;
		},
		_getSubVital: function(vitalName) {

		},
		_getChartData: function(vitalName) {
			return this._generateMockChart(vitalName);
		},
		_plotChart: function(chartID, vitalName) {
			let data = this._getChartData(vitalName);
			var oLineChartItem = new ZANA_01.LineChartItem({
				dim1: "{customer}",
			});
			var filterpath = "";
			/* new  chart */

			var oLineChart = new ZANA_01.LineChart({
				items: {
					path: filterpath,
					template: oLineChartItem
				}
			});
			oLineChart.setData(data);
			return oLineChart;

		},
		_loadVitalList: function(_vitalData) {
			var self = this;
			this.onDialogClick = false;
			let data = _vitalData;
			this.chartList = this.byId("vitalListContainer");
			this.chartList.removeAllItems();
			for (let i = 0; i < data.length; i++) {
				let obj = data[i];
				let vitalTemplate = new sap.m.CustomListItem({
					content: [
						new sap.m.HBox( /*obj.ParentID,*/ {
							items: [
								new sap.ui.core.Icon({
									size: "1.5rem",
									src: "sap-icon://attachment-photo"
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom"),
								//Element for Chart
								new sap.m.VBox( /*obj.ChartID,*/ {
									width: "70%",
									height: "200px",
									items: [
										self._plotChart(obj.ChartID, obj.VitalID)
									]
								}).addStyleClass("chartContainer elementHorizontalSpacingLeftRight"),
								//Element for Vital Data Display
								new sap.m.VBox( /*obj.VitalID,*/ {
									width: "15%",
									height: "200px",
									items: [
										new sap.m.VBox({
											items: [
												new sap.m.Label({
													text: obj.VitalHigh, //VitalLow,
													displayOnly: true,
													height: "50px"
												}).addStyleClass("vitalHigh"),
												new sap.m.Label({
													text: obj.VitalName,
													displayOnly: true,
													height: "70px"
												}).addStyleClass("vitalName"),
												new sap.m.Label({
													text: obj.uom,
													displayOnly: true,
													height: "30px"
												}).addStyleClass("vitalUOM"),
												new sap.m.Label({
													alignItems: sap.m.FlexAlignItems.Left,
													justifyContent: sap.m.FlexJustifyContent.Left,
													text: obj.VitalLow, //VitalHigh,
													displayOnly: true,
													height: "50px"
												}).addStyleClass("vitalLow"),

											]
										}).attachBrowserEvent("click", function(oEvent) {
											//Vital Click Event
											//debugger;
											console.log("Here");
											self._showVitalData(obj.VitalID);
										}),
									],
								}).addStyleClass("vitalContainer elementHorizontalSpacingRight"),
								new sap.m.VBox({
									width: "10%",
									items: [
										self._getSubVitals(obj.VitalID)
									]
								})
							]
						})
					]
				}).addStyleClass("itemSpacing");
				this.chartList.addItem(vitalTemplate);
			}
		},
		_formatSearchList: function(searchParam) {
			if (this.chartData) {
				var refData = this.chartData.map(function(x) {
					return x;
				});
				console.log("Ref Data" + refData);

				var formattedSearchList = _.map(refData, function(o) {
					if (o.VitalName.toString().toLowerCase().indexOf(searchParam.toString().toLowerCase()) >= 0) return o;
				});

				// Remove undefines from the array
				//debugger;
				formattedSearchList = _.without(formattedSearchList, undefined);
				return formattedSearchList;
			}
		},
		_onVitalSearch: function(oEvent) {
			// debugger;
			var vitalToSearch = oEvent.getSource().getValue();
			console.log("Search Param" + vitalToSearch);
			if (vitalToSearch != "" || vitalToSearch != undefined) {
				let formattedData = this._formatSearchList(vitalToSearch);
				this._loadVitalList(formattedData);
			} else {
				this._loadVitalList(this.chartData);
			}

		},
		_showVitalData: function(vitalName) {
			this.onDialogClick = true;
			let data = this._generateTableMockData(vitalName);
			var vitalDataModel = new sap.ui.model.json.JSONModel();
			// vitalDataModel.setData({
			// 	"vitalData": data
			// });
			vitalDataModel.setData(data);
			this.getView().setModel(vitalDataModel, "vitalDataModel");
			sap.ui.getCore().setModel(vitalDataModel, "vitalDataModel");
			this.editClicked = false;
			this.getDialog(data).open();
		},
		onSubmitVital: function(ctx) {
			var dialog = ctx.getSource().oParent;
			dialog.close();
			this.onDialogClick = true;
			/*Logic to read items from table which are selected*/
			var msg = 'Vital Data has been updated';
			MessageToast.show(msg);
		},
		onDeleteVital: function(ctx) {
			var dialog = ctx.getSource().oParent;
			dialog.close();
			this.onDialogClick = true;
			/*Logic to read items from table which are selected*/
			var msg = 'Selected Entries have been deleted';
			MessageToast.show(msg);
		},
		onCancelDialog: function(ctx) {
			var dialog = ctx.getSource().oParent;
			dialog.close();
			this.onDialogClick = true;
			//dialog.destroy(true);
		},
		_onDisAssociate: function(oEvent) {

		},
		_onAssociate: function(oEvent) {

		},
		_onCancelDialogAssociate: function(ctx) {
				var dialog = ctx.getSource().oParent;
				dialog.close();
				this.onDialogClick = true;
			}
			/********Data Loader****************/

	});
});

/**References used**/
/******
 * @ - https://blogs.sap.com/2019/03/28/creating-custom-ui5-control-from-d3-chart/
 * @ - https://blogs.sap.com/2015/08/21/how-to-use-drag-and-drop-between-two-sapui5-ui-elements/
 * @ - https://jsbin.com/wizitamoqi/edit?html,console,output
 * @ - https://blogs.sap.com/2015/07/02/hcp-abap-and-websocket-part-1/
 * @ - https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
 * @ - https://stackoverflow.com/questions/47606169/how-to-select-all-checkbox-in-sap-ui5
 */