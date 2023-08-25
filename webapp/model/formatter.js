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
				return sUserType;
			}
		},
		getUserStatus: function(sStatus){
			if(sStatus){
				if(sStatus.toUpperCase() === "X" || sStatus.toUpperCase() === "YES"){
					return "Active";
				}else if(sStatus.toUpperCase() === "" || sStatus.toUpperCase() === " " || sStatus.toUpperCase() === "NO"){
					return "Inactive";
				}else {
					return sStatus;
				}
			}else{
				return sStatus;
			}
		},
		getUserStatusState: function(sStatus){
			if(sStatus){
				if(sStatus.toUpperCase() === "X" || sStatus.toUpperCase() === "YES"){
					return "Success";
				}else if(sStatus.toUpperCase() === "" || sStatus.toUpperCase() === " "  || sStatus.toUpperCase() === "NO"){
					return "Error";
				}else {
					return "Information";
				}
			}else{
				return sStatus;
			}

		},
		getUserStatusIcon: function(sStatus){
			if(sStatus){
				if(sStatus.toUpperCase() === "X" || sStatus.toUpperCase() === "YES"){
					return "sap-icon://sys-enter-2";
				}else if(sStatus.toUpperCase() === "" || sStatus.toUpperCase() === " " || sStatus.toUpperCase() === "NO"){
					return "sap-icon://error";
				}else {
					return "sap-icon://information";
				}
			}else{
				return sStatus;
			}

		},
		setIconVisibility: function(sStatus){
			if(sStatus){
				if(sStatus.toUpperCase() === "X" || sStatus.toUpperCase() === "YES"){
					return true;
				}else {
					return false;
				}
			}else{
				return sStatus;
			}

		}

	};
});