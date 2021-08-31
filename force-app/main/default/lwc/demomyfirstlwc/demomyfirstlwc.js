import { LightningElement, track, wire, api } from 'lwc';
import { createRecord, deleteRecord, getRecord, getRecordUi, updateRecord } from 'lightning/uiRecordApi';
import Account_Object from '@salesforce/schema/Account';
import Source_Field from '@salesforce/schema/Account.Source__c';
import BillingState_Field from '@salesforce/schema/Account.BillingState';
import Name_Field from '@salesforce/schema/Account.Name';
import RecordTypeId_Field from '@salesforce/schema/Account.RecordTypeId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c';
import { publish, MessageContext } from 'lightning/messageService';
import insertLogger from '@salesforce/apex/accountSearchController.insertLogger'
import { NavigationMixin } from 'lightning/navigation'

export default class Demomyfirstlwc extends NavigationMixin(LightningElement) {
    @track firstName = 'Shubham';
    searchDetails = [];
    accountDataforCreation;
    isFirstLWCVisible = true;
    @api valuefromaura;
    navigationURL;
    objectName;
    filterName;
    AccountName;

    @wire(MessageContext)
    messageContext;

    handleTextOnChange(event) {
        var firstName = 'Test';
        this.firstName = event.target.value;
    }

    @wire(getRecord, { recordId: '0015g00000OvLGRAA3', fields: [Name_Field], optionalFields: [Source_Field] })
    accountsDatafromGetRecord({ data, error }) {
        if (data) {
            console.log(data);
            this.AccountName = data.fields.Name.value;
        } else {
            console.log(error);
        }
    }

    @wire(getRecord, { recordId: '0015g00000OvLGRAA3', fields: [Name_Field], optionalFields: [Source_Field], modes: 'Create' })
    accountsDatafromGetRecord1({ data, error }) {
        if (data) {
            console.log(data);
        } else {
            console.log(error);
        }
    }

    @wire(getRecordUi, { recordIds: '0015g00000OvLGRAA3', layoutTypes: 'Full', modes: 'View' })
    accountRecordUi({ data, error }) {
        if (data) {
            console.log(data);
        } else {
            console.log(error);
        }
    }

    connectedCallback() {
        //console.log('ValuesFromAura:' +this.valueFromAura);
        //this.updatedAccount();
        /*deleteRecord('0015g00000OvLGgAAN').then(result=>{
            console.log('Record Deleted' + result);
        })
        .catch(error=>{
            console.log('Record Deletion Error' + error);
        })*/
        var dataTableStyle = document.createElement('style');
        dataTableStyle.innerHTML = `
                                    .redRow{
                                        background: red
                                    }
                                    .greenRow{
                                        background: green
                                    }
                                    `
        document.head.appendChild(dataTableStyle);
    }
    updatedAccount() {
        const fields = {};
        fields[Name_Field.fieldApiName] = 'Updated Account Name';
        fields[Source_Field.fieldApiName] = 'Paradot';
        fields['Id'] = '0015g00000OvLGRAA3';
        var Record = {
            "fields": fields
        };
        updateRecord(Record)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account Updated updated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    handleAccountData(event) {
        this.accountDataforCreation = event.detail.inputDetails;
        this.searchDetails = [];
        console.log(event.detail.results);
        event.detail.results.forEach(x => {
            var accData = {
                id: x.Id,
                name: x.Name,
                website: x.Website,
                phone: x.Phone,
                revenue: x.AnnualRevenue,
                address: (x.BillingAddress == null || x.BillingAddress == undefined) ? '' : x.BillingAddress.state,
                revenueIcon: x.AnnualRevenue > 40000 ? 'utility:arrowup' : 'utility:arrowdown',
                revenueClass: x.AnnualRevenue > 40000 ? 'greenRow' : 'redRow'
            }
            this.searchDetails.push(accData);
        });
    }

    handleResetData(event) {
        this.searchDetails = event.detail;
    }

    handleCreateNewAccount() {
        console.log('accountDataforCreation' + this.accountDataforCreation);
        const fields = {};
        fields[Name_Field.fieldApiName] = this.accountDataforCreation["accountName"];
        fields[Source_Field.fieldApiName] = this.accountDataforCreation["source"];
        fields[RecordTypeId_Field.fieldApiName] = this.accountDataforCreation["recordTypeId"];
        fields[BillingState_Field.fieldApiName] = this.accountDataforCreation["billingState"];
        var Record = {
            "apiName": Account_Object.objectApiName,
            "fields": fields
        };
        createRecord(Record)
            .then(result => {
                console.log(result);
                //alert('Account created: '+ result.id);
                this.navigateToStandardRecordPage(result.id);
            })
            .catch(error => {
                console.log(error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: this.handleError(error, ''),
                    variant: 'error',
                    mode: 'sticky'
                }))

                const logData = {
                    Method_Name__c: 'handleCreateNewAccount',
                    Component_Name__c: 'Demomyfirstlwc',
                    Error__c: this.handleError(error, '')
                }
                insertLogger({ log: logData })
                    .then(loggerResult => {
                        console.log(loggerResult);
                    })
            });
    }

    handleError(error, errorMessage) {
        var message = errorMessage;
        if (Array.isArray(error.body)) {
            message = message + ' ' + error.body.map(e => e.message).join(', ')
        } else if (typeof error.body.message === 'string') {
            message = message + ' ' + error.body.message
        }
        if (error.body != null && error.body.output != null) {
            if (error.body.output.errors != null && typeof error.body.output.errors === 'object' && error.body.output.errors.length > 0) {
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
            } else if (error.body.output.fieldErrors != null && typeof error.body.output.errors === 'object') {
                error.body.output.fieldErrors.forEach(x => {
                    Object.keys(x).forEach(y => {
                        console.log(y);
                    });
                });
            }
        }
        return message
    }

    handleMoreInfo(event) {
        this.isFirstLWCVisible = false;
        const payload = { accountName: this.accountDataforCreation["accountName"], isVisible: true }
        publish(this.messageContext, moreInfoChannel, payload);
    }

    navigateToStandardRecordPage(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        });
        // this[NavigationMixin.GenerateUrl]({
        //     type: 'standard__recordPage',
        //     attributes: {
        //         recordId: recordId,
        //         actionName: 'view'
        //     }
        // }).then(url=>{
        //     console.log(url);
        //     this.navigationURL = url;

        //     this.dispatchEvent(new ShowToastEvent({
        //         title: 'Success',
        //         message: 'Account created succesfully. Click {0}',
        //         variant: 'success',
        //         mode: 'sticky',
        //         messageData: [{
        //             url,
        //             label: 'here'
        //         }]
        //     }))

        // })
    }

    onChangeObjectName(event) {
        this.objectName = event.target.value;
    }

    onChangeFilterName(event) {
        this.filterName = event.target.value;
    }

    navigateToListView() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectName,
                actionName: 'list'
            },
            state: {
                // 'filterName' is a property on the page 'state'
                // and identifies the target list view.
                // It may also be an 18 character list view id.
                filterName: this.filterName // or by 18 char '00BT0000002TONQMA4'
            }
        });

        /*this[NavigationMixin.GenerateUrl]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectName,
                actionName: 'list'
            },
            state: {
                filterName: this.filterName
            }
            }).then(url=>{
                window.open(url);
            })*/
    }
}