sap.ui.define([], function () {
	"use strict";
	return {
		getUserType: function(sUserType){
			if(sUserType === "A"){
				return "Admin";
			}else if(sUserType === "C"){
				return "Customer";
			}else if( sUserType === "V"){
				return "Franchisee"
			}else {
				return "";
			}
		}

	};
});