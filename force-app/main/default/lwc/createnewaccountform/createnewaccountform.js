import { LightningElement, api, wire, track } from "lwc";
import {
  createMessageContext,
  releaseMessageContext,
  subscribe,
  unsubscribe,
  publish,
} from "lightning/messageService";
import Account_Record_Created_CHANNEL from '@salesforce/messageChannel/Create_Account__c';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from "lightning/uiRecordApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import CONTACT_OBJECT from "@salesforce/schema/Contact";
import LOGGER_OBJECT from "@salesforce/schema/Logger__c";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import BillingCity_FIELD from "@salesforce/schema/Account.BillingCity";
import BillingState_FIELD from "@salesforce/schema/Account.BillingState";
import BillingPostalCode_FIELD from "@salesforce/schema/Account.BillingPostalCode";
import BillingCountry_FIELD from "@salesforce/schema/Account.BillingCountry";
import RecordTypeId_FIELD from "@salesforce/schema/Account.RecordTypeId";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getAccountRecordTypes from '@salesforce/apex/createNewAccountController.getAccountRecordTypes';
import insertLogger from '@salesforce/apex/createNewAccountController.insertLogger';
import MethodName_FIELD from "@salesforce/schema/Logger__c.Method_Name__c";
import ComponentName_FIELD from "@salesforce/schema/Logger__c.Component_Name__c";
import Error_FIELD from "@salesforce/schema/Logger__c.Error__c";

export default class Createnewaccountform extends LightningElement {
  @api accountName;
  @api cityName;
  @api stateName;
  @api zipCode;
  @api countryName;
  @track typeofAccount;
  @track options= [];

  context = createMessageContext();

  @wire(getObjectInfo, {
		objectApiName: ACCOUNT_OBJECT
	})
	DataReturnedFromAccountObjectInfo({
		error,
		data
	}) {
		if (data) { 
      console.log(data);
      this.options= [];
      Object.keys(data.recordTypeInfos).forEach(key=>{
        var optionItem = {
          label: data.recordTypeInfos[key].name,
          value: data.recordTypeInfos[key].recordTypeId
        }
        this.options.push(optionItem);
      });
    }
	}

  @wire(getObjectInfo, {
		objectApiName: CONTACT_OBJECT
	})
	DataReturnedFromContactObjectInfo({
		error,
		data
	}) {
		if (data) { 
      console.log(data);
    }
	}

  @wire(getAccountRecordTypes)
  DataReturnedFromApexClass({error,data}){
    if(data){
      console.log(data);
    }
    else if(error){
      console.log(error);
    }
  }

  handleShowAccountSearch(event) {
    const customEvent = new CustomEvent("showsearchstep", {
      detail: {
        accountName: this.accountName,
        cityName: this.cityName,
        stateName: this.stateName,
        zipCode: this.zipCode,
        countryName: this.countryName,
      },
    });
    this.dispatchEvent(customEvent);
  }

  handleAccountNameChange(event) {
    this.accountName = event.target.value;
  }

  handleCityNameChange(event) {
    this.cityName = event.target.value;
  }

  handleStateNameChange(event) {
    this.stateName = event.target.value;
  }

  handleZipCodeChange(event) {
    this.zipCode = event.target.value;
  }

  handleCountryNameChange(event) {
    this.countryName = event.target.value;
  }

  handleRecordTypeChange(event){
    this.typeofAccount = event.target.value;
  }

  createAccount() {
    const isInputsCorrect = [
      ...this.template.querySelectorAll("lightning-input"),
    ].reduce((validSoFar, inputField) => {
      inputField.reportValidity();
      return validSoFar && inputField.checkValidity();
    }, true);
    if (!isInputsCorrect) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message: "Input the required fields",
          variant: "error",
        })
      );
    }
    if (isInputsCorrect) {

      const fields = {};
      //var TestFieldAPIName = 'TestField__c';
      fields[NAME_FIELD.fieldApiName] = this.accountName;
      fields[BillingState_FIELD.fieldApiName] = this.stateName;
      fields[BillingCity_FIELD.fieldApiName] = this.cityName;
      fields[BillingPostalCode_FIELD.fieldApiName] = this.zipCode;
      fields[BillingCountry_FIELD.fieldApiName] = this.countryName;
      fields[RecordTypeId_FIELD.fieldApiName] = this.typeofAccount;
      //fields[TestFieldAPIName] = 'Test Value';
      const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
      createRecord(recordInput)
        .then((account) => {
          //this.accountId = account.id;
          const customEvent = new CustomEvent("hidecreatenewaccount", {
            detail: false
           });
          this.dispatchEvent(customEvent);

          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Account created",
              variant: "success",
            })
          );

          const payload = {recordid: account.id};
          publish(this.context, Account_Record_Created_CHANNEL, payload);
        })
        .catch((error) => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error creating record",
              message: this.handleError(error,''),
              variant: "error",
              mode:"sticky"
            })
          );
        });
    }
  }

  createLoggerEntry(errorMessage){
    const fields = {};
      fields[MethodName_FIELD.fieldApiName] = 'createneaccountform';
      fields[ComponentName_FIELD.fieldApiName] = 'createaccount';
      fields[Error_FIELD.fieldApiName] = errorMessage;
      const recordInput = { apiName: LOGGER_OBJECT.objectApiName, fields };
      const logData = {
        Method_Name__c: 'createaccount',
        Component_Name__c: 'createneaccountform',
        Error__c: errorMessage
      }
      insertLogger({log:logData})
      .then(loggerResult=>{
        console.log(loggerResult);
      })
      .catch(error=>{
        console.log(error);
      })
  }

  handleError(error, errorMessage) {
		var message = errorMessage;
		if (Array.isArray(error.body)) {
			message = message + ' ' + error.body.map(e => e.message).join(', ')
		} else if (typeof error.body.message === 'string') {
			message = message + ' ' + error.body.message
		}
		if (error.body != null && error.body.output != null) {
			if(error.body.output.errors != null && typeof error.body.output.errors === 'object' && error.body.output.errors.length > 0){
				error.body.output.errors.forEach(er => {
				message = message + ' ' + er.errorCode;
				message = message + ' ' + er.message;
				if (er.duplicateRecordError != null && typeof er.duplicateRecordError === 'object' && er.duplicateRecordError.matchResults != null && typeof er.duplicateRecordError.matchResults === 'object' && er.duplicateRecordError.matchResults.length > 0) {
					message = message + ' Following are the matching records';
					er.duplicateRecordError.matchResults.forEach(erMatchRec => {
						erMatchRec.matchRecordIds.forEach(matchRec => {
							message = message + ' ' + matchRec
						})
					})
					}
				});	
			}
			else if(error.body.output.fieldErrors !=null && typeof error.body.output.errors === 'object'){
				Object.keys(error.body.output.fieldErrors).forEach(x=>{
            console.log(x);
            error.body.output.fieldErrors[x].forEach(y=>{
              message = message + ' ' + y.errorCode;
				      message = message + ' ' + y.message;
            })
				});   
			}
		}
    this.createLoggerEntry(message);
		return message
	}
}