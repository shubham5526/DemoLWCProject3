import { LightningElement, wire } from 'lwc';
import getAccountsData from '@salesforce/apex/accountSearchController.searchAccounts';
import getRecordType from '@salesforce/apex/accountSearchController.getRecordTypes';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c';
import { publish, MessageContext } from 'lightning/messageService';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getObjectInfos } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import Logger_OBJECT from '@salesforce/schema/Logger__c';
import Source_FIELD from '@salesforce/schema/Account.Source__c';

export default class Demomysecondlwc extends LightningElement {
    accountName;
    accountPhone;
    billingStreet;
    billingCity;
    billingState;
    billingZipcode;
    accType;
    optionsAccType=[];
    accSource;
    optionsAccSource=[];
    selectedRecordType;
    isResetButtonVisible = false;

    @wire(getPicklistValues, { recordTypeId: '$selectedRecordType', fieldApiName: Source_FIELD })
    getAccountSourceValues({data,error}){
        if(data){
            console.log(data);
            this.optionsAccSource = [];
            data.values.forEach(item=>{
                var source = {
                    label: item.label,
                    value: item.value,
                };
                this.optionsAccSource.push(source);
            });
            this.optionsAccSource = [...this.optionsAccSource];
        }

        else{
            console.log(error);
        }
    }

    @wire(getPicklistValuesByRecordType, { objectApiName: ACCOUNT_OBJECT, recordTypeId: '0125g000000uSZCAA2' })
    getAccountPickListValues({data,error}){
        if(data){
            console.log(data);
        }

        else{
            console.log(error);
        }
    }

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    getAccountObjectInfo({data,error}){
        if(data){
            console.log(data);
        }

        else{
            console.log(error);
        }
    }

    @wire(getObjectInfos, { objectApiNames: [ACCOUNT_OBJECT, Logger_OBJECT ]})
    getObjectsInfoData({data,error}){
        if(data){
            console.log('ObjectInfos:' + data);
        }

        else{
            console.log(error);
        }
    }

    @wire(MessageContext)
    messageContext;

    @wire(getRecordType,{objName:'Account'})
    getRecordType({data,error}){
        if(data){
            console.log(data);
            data.forEach(element => {
                var item = {
                    label: element.Name,
                    value: element.Id
                };
                this.optionsAccType.push(item);
            });
            this.optionsAccType = [... this.optionsAccType];
        }
        else if(error){
            console.log(error);
        }
    }

    // get optionsAccType() {
    //     return [
    //         { label: 'Individual', value: '0125g000000uSZ7AAM' },
    //         { label: 'Corporate', value: '0125g000000uSZCAA2' },
    //     ];
    // }

    handleOnChange(event){
       if(event.target.name === 'accountName'){
           this.accountName = event.target.value;
       }
       else if(event.target.name === 'accountPhone'){
           this.accountPhone = event.target.value;
       }
    }

    handleOnChangeBillStrt(event){
        this.billingStreet = event.target.value;
    }

    handleOnChangeBillCity(event){
        this.billingCity = event.target.value;
    }

    handleOnChangeBillState(event){
        this.billingState = event.target.value;
    }

    handleOnChangeBillZipCode(event){
        this.billingZipcode = event.target.value;
    }

    handleAccountSearch(event){
        var isValid = this.ValidateFields();
        if(isValid){
            this.isResetButtonVisible = true;
            getAccountsData({accountName: this.accountName, billingState: this.billingState})
            .then(results=>{
                console.log(results);
                this.dispatchEvent(new CustomEvent('getaccountdata', {
                    detail: { results: results, 
                        inputDetails: {
                            recordTypeId : this.selectedRecordType,
                            source: this.accSource,
                            accountName: this.accountName,
                            billingState: this.billingState
                    }}
                }));
                const payload = {accountName: this.accountName, isVisible:false}
                publish(this.messageContext,moreInfoChannel,payload);
            })
            .catch(error=>{
                console.log(error);
            });
            console.log('I got called from apex retuned the data');
        }
    }

    ValidateFields(){
        console.log(this.template.querySelector('lightning-input'));
        console.log(this.template.querySelectorAll('lightning-input'));
        const allInputValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                        if(!inputCmp.checkValidity()){
                            if(inputCmp.label==='Account Name'){
                                inputCmp.setCustomValidity('Please enter the account name');
                            }
                            if(inputCmp.label==='Billing State'){
                                inputCmp.setCustomValidity('Please enter the billing state');
                            }
                        }
                        inputCmp.reportValidity();
                        inputCmp.setCustomValidity('');
                        return validSoFar && inputCmp.checkValidity();
            }, true);

            const allComboBoxValid = [...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                        if(!inputCmp.checkValidity()){
                            if(inputCmp.label==='Account Type'){
                                inputCmp.setCustomValidity('Please select the account type');
                            }
                            if(inputCmp.label==='Account Source'){
                                inputCmp.setCustomValidity('Please select the account source');
                            }
                        }
                        inputCmp.reportValidity();
                        inputCmp.setCustomValidity('');
                        return validSoFar && inputCmp.checkValidity();
            }, true);

        return allInputValid && allComboBoxValid;
        // if (allValid) {
        //     alert('All form entries look valid. Ready to submit!');
        // } else {
        //     alert('Please update the invalid form entries and try again.');
        // }
    }

    handleReset(event){
        this.accountName = '';
        this.accountPhone = '';
        this.billingStreet = '';
        this.billingCity = '';
        this.billingState = '';
        this.billingZipcode = '';
        this.dispatchEvent(new CustomEvent('resetdata', {
            detail: []
        }));
        const payload = {accountName: this.accountName, isVisible:false}
        publish(this.messageContext,moreInfoChannel,payload);
    }

    handleAccTypeChange(event){
        console.log(event);
        this.selectedRecordType = event.target.value;
    }

    handleAccSourceChange(event){
        console.log(event);
        this.accSource = event.target.value;
    }
}