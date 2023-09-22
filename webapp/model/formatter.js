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
			}else {
				return "Inactive";
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
				return "Error";
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
				return "sap-icon://error";
			}

		},
		setIconVisibility: function(sStatus){
			if(sStatus){
				if(sStatus.toUpperCase() === "X" || sStatus.toUpperCase() === "YES"){
					return true;
				}else {
					return false;
				}
			}

		},
		formatDate: function (date) {
			var d = date,
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		
			if (month.length < 2) 
				month = '0' + month;
			if (day.length < 2) 
				day = '0' + day;
		
			return [year, month, day].join('-');
		},
		formatDateyyyMMdd: function (d){
			var month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
		
			if (month.length < 2) 
				month = '0' + month;
			if (day.length < 2) 
				day = '0' + day;
		
			return [year, month, day].join('');
		},
		getBranch: function(sBranch, sUserType){
			if(sUserType == "A" || sUserType == "C"){
				return 'NA';
			}else{
				return sBranch;
			}
		},
		getRegion: function(regionDesc, regionCode, userType){
			if(userType == "A"){
				return "NA";
			}else{
				return regionDesc + " (" + regionCode + ")";
			}
		}

	};
});