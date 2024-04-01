sap.ui.define(
    ["com/ifb/invoicegenerator/controller/BaseController", "../model/formatter", "sap/m/MessageToast",
    "com/ifb/invoicegenerator/model/models", "sap/ui/model/json/JSONModel", "sap/m/library"],
    function (Controller, formatter, MessageToast, models, JSONModel, mobileLibrary) {
      "use strict";
  
      var URLHelper = mobileLibrary.URLHelper;
      return Controller.extend(
        "com.ifb.invoicegenerator.controller.DigitalSignature",
        {
          formatter: formatter,
  
          onInit: function () {
            // Get Router Info
            this.oRouter = this.getOwnerComponent().getRouter();
            // Calling _handleRouteMatched before UI Rendering
            this.oRouter.getRoute("digitalsignature").attachPatternMatched(this._handleRouteMatched, this);
          },
          _handleRouteMatched: async function(oEvent){

            var sSelectedDate = oEvent.getParameter("arguments").selectedDate;

            if(!this.getOwnerComponent().getModel("LoginDataModel")){
              if(localStorage.getItem("email") && localStorage.getItem("password")){
                await this._login(localStorage.getItem("email"), localStorage.getItem("password"));
                if(sSelectedDate){
                  var sYear = sSelectedDate.substring(0,4);
                  var sMonth = sSelectedDate.slice(-2);
                  var sValue = String(sMonth) + "-" + String(sYear);

                  var sDate = new Date(sYear, (parseInt(sMonth) - 1));
                  var sDatePicker = this.byId("idDSStartDate");
                  
                  sDatePicker.setDateValue(sDate);
                  sDatePicker.fireChange();

                }else{
                  this.byId("idDSStartDate").setValue("");      
                }
              }else{
                this.getOwnerComponent().getRouter().navTo("login");
                return;
              }

              var oDataModel = new JSONModel({});
              this.getView().setModel(oDataModel, "signedDataModel");
            }
            this.setMaxDate(new Date());
            var sDisable = {};
            sDisable.isDigitallySigned = false;

            var oModel = new JSONModel(sDisable);
            this.getView().setModel(oModel, "buttonDisability");

          },
          setMaxDate: function(sDate){
            sDate.setDate(1); // going to 1st of the month
            sDate.setHours(-1); // going to last hour before this date even started.
            this.byId("idDSStartDate").setMaxDate(sDate);
          },
          onSubmitPress: async function(oEvent){
            if(this.byId("idDSStartDate").getDateValue() == null){
              MessageToast.show("Please enter valid date");
              return;
            }

            const date = this.getFirstAndLastDay(this.byId("idDSStartDate").getDateValue(), "DigitalSign");
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            const sResponse = await models.createDigitalRecordsBatch(date, userDetails);

            if(sResponse.messageCode && sResponse.messageCode == "E"){
                MessageToast.show(sResponse.messageString);
                return;
            }
            if(sResponse){
              this.checkButtonDisability(this.byId("idDSStartDate"));
            }

          },
          
          getFirstAndLastDay: function(sDate, sOperation) {
            let firstDay = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
            let lastDay = new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0);
            console.log("First day=" + firstDay)
            console.log("Last day = " + lastDay);
             if(sOperation == "Sync"){
              return {
                firstDay: formatter.formatDate(firstDay),
                lastDay: formatter.formatDate(lastDay),
                fiscalYear: sDate.getFullYear()
              }
             }else{
              return {
                firstDay: formatter.formatDateyyyMMdd(firstDay),
                lastDay: formatter.formatDateyyyMMdd(lastDay)
              }
             }
          },
          onDatePickerChange: function(oEvent){
            this.checkButtonDisability(oEvent.getSource());
            var oDataModel = new JSONModel({});
            this.getView().setModel(oDataModel, "signedDataModel");
          },
          checkButtonDisability: async function(sDateControl){
            var sDisable = {};
            if(sDateControl.getDateValue() == null){
              
              sDisable.isDigitallySigned = false;

              var oModel = new JSONModel(sDisable);
              this.getView().setModel(oModel, "buttonDisability");
              return;
            }
            const date = this.getFirstAndLastDay(this.byId("idDSStartDate").getDateValue(), "DigitalSign");
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            const sResponse = await models.getDigitalRecords(date, userDetails);
            if(sResponse.messageCode && sResponse.messageCode == "E"){
                sDisable.isDigitallySigned = false;
                return;
            }
            if(sResponse && sResponse.length != 0){
                sDisable.isDigitallySigned = false;
                var oDataModel = new JSONModel(sResponse);
                this.getView().setModel(oDataModel, "signedDataModel");
            }else {
              sDisable.isDigitallySigned = true;
            }

            var oModel = new JSONModel(sDisable);
            this.getView().setModel(oModel, "buttonDisability");
          },
          onEsignPressed: function(oEvent){
            var sBindingContext = oEvent.getSource().getParent().getParent().getBindingContext("signedDataModel");
            var sData = sBindingContext.getModel().getProperty(sBindingContext.getPath());
            var sReferenceNum = sData.fileName.split(".")[0] +"_" + new Date().getTime();
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            var sUrl = this.getOwnerComponent().rootURL + "EsignForm.aspx?pdflocation=" + sData.filePath + "&referenceNum=" +
            sReferenceNum + "&signatureName=" + userDetails.firstname;

            URLHelper.redirect(sUrl, false);

          },
          onSaveFilePressed: async function(oEvent){
            var sBindingContext = oEvent.getSource().getParent().getParent().getBindingContext("signedDataModel");
            var sData = sBindingContext.getModel().getProperty(sBindingContext.getPath());
            const date = this.getFirstAndLastDay(this.byId("idDSStartDate").getDateValue(), "DigitalSign");
            const userDetails = this.getOwnerComponent().getModel("LoginDataModel").getData();

            const sResponse = await models.saveDigitalFiles(date, userDetails, sData.fileName);
            if(sResponse.messageCode && sResponse.messageCode == "E"){
                MessageBox.error(sResponse.messageString);
                return;
            }else{
              MessageToast.show(sResponse.messageString);
              const sRes = await models.getDigitalRecords(date, userDetails);
              if(sRes.messageCode && sRes.messageCode == "E"){
                  return;
              }
              if(sRes && sRes.length != 0){
                  var oDataModel = new JSONModel(sRes);
                  this.getView().setModel(oDataModel, "signedDataModel");
              }else {
                sDisable.isDigitallySigned = true;
              }
            }
          }
        }
      );
    }
  );
  