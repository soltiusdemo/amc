jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.declare("ZANA_01.utils.UIHelper");

ZANA_01.utils.UIHelper = (function() {
	var _cntrlrInst = null;
	var _isChangeAction = false;
	return {

		setControllerInstance : function(oControllerInst) {
			_cntrlrInst = oControllerInst;
		},

		getControllerInstance : function() {
			return _cntrlrInst;
		},
		setIsChangeAction : function(oStatus) {
			_isChangeAction = oStatus;
		},

		getIsChangeAction : function() {
			return _isChangeAction;
		},
		errorDialog : function(messages) {

			var _errorTxt = "";
			var _firstMsgTxtLine = "";
			var _detailmsg = "";
			var oSettings = "";

			if (typeof messages === "string") {
				oSettings = {
					message : messages,
					type : sap.ca.ui.message.Type.ERROR
				};
			} else if (messages instanceof Array) {

				for ( var i = 0; i < messages.length; i++) {
					_errorTxt = "";
					if (typeof messages[i] === "string") {
						_errorTxt = messages[i];
					} else if (typeof messages[i] === "object") {
						_errorTxt = messages[i].value;
					}
					_errorTxt.trim();
					if( _errorTxt !== ""){
    					if (i === 0) {
    						_firstMsgTxtLine = _errorTxt;
    					} else {
    						_detailmsg = _detailmsg + _errorTxt + "\n";
    					}
					}
				}

				if (_detailmsg == "") { // do not show any details if none are there
					oSettings = {
						message : _firstMsgTxtLine,
						type : sap.ca.ui.message.Type.ERROR
					};
				} else {
					oSettings = {
						message : _firstMsgTxtLine,
						details : _detailmsg,
						type : sap.ca.ui.message.Type.ERROR
					};
				}

			}
			sap.ca.ui.message.showMessageBox(oSettings);
		}

	};

}());