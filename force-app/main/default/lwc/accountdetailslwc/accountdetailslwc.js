import { LightningElement, wire, api } from 'lwc';
import accountDetailsMC1 from '@salesforce/messageChannel/Account_Details__c';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import { createRecord } from "lightning/uiRecordApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import BillingStreet_FIELD from "@salesforce/schema/Account.BillingStreet";
import BillingCity_FIELD from "@salesforce/schema/Account.BillingCity";
import BillingState_FIELD from "@salesforce/schema/Account.BillingState";
import BillingPostalCode_FIELD from "@salesforce/schema/Account.BillingPostalCode";
import BillingCountry_FIELD from "@salesforce/schema/Account.BillingCountry";
import LegalName_FIELD from "@salesforce/schema/Account.Legal_Name__c"
import Website_FIELD from "@salesforce/schema/Account.Website"
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Handle_Error from '@salesforce/resourceUrl/errorHandleModule';
import { loadScript } from 'lightning/platformResourceLoader';
import createLogger from '@salesforce/apex/CreateNewAccountControllerLWC.createLogger';

export default class Accountdetailslwc extends NavigationMixin(LightningElement) {
    accountDetails;
    accountName;
    messageSubscriber;
    imgURL;
    domain;
    legalName;
    @api isVisible;
    //@api year;

    // constructor() {
    //     super();
    //     this.isVisible = true;
    // }

    renderedCallback() {
        loadScript(this, Handle_Error)
            .then(() => console.log('Loaded Handle_Error'))
            .catch(error => console.log(error));
        // Promise.all([
        //         loadScript(this, Handle_Error)
        //     ])
        //     .then(() => {
        //         console.log('Loaded Handle_Error');
        //     })
        //     .catch(error => {
        //         alert(error.body.message);
        //     });
    }

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.messageSubscriber = subscribe(this.messageContext, accountDetailsMC1, (msg) => this.getAccountDetails(msg));
    }

    disconnectedCallback() {
        unsubscribe(this.messageSubscriber);
    }

    getAccountDetails(message) {
        console.log(message);
        if (message != undefined && message.accountDetails != undefined) {
            this.accountDetails = message.accountDetails;
            this.accountName = message.accountDetails.accName;
            this.isVisible = true;
            this.fetchCompanyWebSite(this.accountName);
        } else {
            this.accountDetails = '';
            this.accountName = '';
            this.isVisible = false;
        }
    }

    fetchCompanyWebSite(companyName) {
        fetch('https://company.clearbit.com/v1/domains/find?name=' + companyName, {
                method: "GET",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Authorization": "Bearer sk_6b6f44b87111aeb5f86ec595af49194c"
                }
            })
            .then((response) => {
                return response.json(); // returning the response in the form of JSON
            })
            .then((jsonResponse) => {
                console.log('jsonResponse ===> ' + JSON.stringify(jsonResponse));
                this.fetchCompanyDetails(jsonResponse.domain);
            })
            .catch(error => {
                console.log('callout error 1 ===> ' + error);
            })
    }

    fetchCompanyDetails(domain) {
        fetch('https://company.clearbit.com/v2/companies/find?domain=' + domain, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer sk_6b6f44b87111aeb5f86ec595af49194c"
                }
            })
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                this.imgURL = jsonResponse.logo;
                this.domain = jsonResponse.domain;
                this.legalName = jsonResponse.legalName;
                this.jsonData = JSON.stringify(jsonResponse);
                console.log('jsonResponse ===> ' + JSON.stringify(jsonResponse));
            })
            .catch(error => {
                console.log('callout error 2 ===> ' + error);
            })
    }

    createNewAccount() {
        //syntax
        //fields[apiNameofTheField] = 'Value'
        const fields = {};
        //fields[NAME_FIELD.fieldApiName] = this.accountDetails.accName;
        fields['Name'] = this.accountDetails.accName;
        fields[BillingStreet_FIELD.fieldApiName] = this.accountDetails.billingStreet;
        fields[BillingState_FIELD.fieldApiName] = this.accountDetails.billingState;
        fields[BillingCity_FIELD.fieldApiName] = this.accountDetails.billingCity;
        fields[BillingPostalCode_FIELD.fieldApiName] = this.accountDetails.billingZipcode;
        fields[BillingCountry_FIELD.fieldApiName] = 'USA';
        fields[LegalName_FIELD.fieldApiName] = this.legalName;
        fields[Website_FIELD.fieldApiName] = this.domain;
        //const recordInput = { apiName: ACCOUNT_OBJECT.fieldApiName, fields };
        const recordInput = { apiName: 'Account', fields };
        createRecord(recordInput)
            .then(x => {
                console.log('Account Created: ' + x);
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__recordPage',
                //     attributes: {
                //         recordId: x.id,
                //         actionName: 'view'
                //     }
                // });

                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: x.id,
                        actionName: 'view'
                    }
                }).then(url => {
                    console.log(url);
                    //this.navigationURL = url;

                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created succesfully. Click {0}',
                        variant: 'success',
                        mode: 'sticky',
                        messageData: [{
                            url,
                            label: 'here'
                        }]
                    }))
                })
            })
            .catch(e => {
                console.log('Account Creation Error: ' + e);
                var errorMessage = window.handleError(e, '');
                var objlog = {
                    Component_Name__c: 'Accountdetailslwc',
                    Error__c: errorMessage,
                    Method_Name__c: 'createNewAccount'
                };
                createLogger({ log: objlog })
                    .then(x => { console.log('Logger Entry Created') })
                    .catch(e => { console.log(e) });
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: errorMessage,
                    variant: 'error',
                    mode: 'sticky'
                }))
            })
    }

    // handleError(error, errorMessage) {
    //     var message = errorMessage;
    //     if (Array.isArray(error.body)) {
    //         message = message + ' ' + error.body.map(e => e.message).join(', ')
    //     } else if (typeof error.body.message === 'string') {
    //         message = message + ' ' + error.body.message
    //     }
    //     if (error.body != null && error.body.output != null) {
    //         if (error.body.output.errors != null && typeof error.body.output.errors === 'object' && error.body.output.errors.length > 0) {
    //             error.body.output.errors.forEach(er => {
    //                 message = message + ' ' + er.errorCode;
    //                 message = message + ' ' + er.message;
    //                 if (er.duplicateRecordError != null && typeof er.duplicateRecordError === 'object' && er.duplicateRecordError.matchResults != null && typeof er.duplicateRecordError.matchResults === 'object' && er.duplicateRecordError.matchResults.length > 0) {
    //                     message = message + ' Following are the matching records';
    //                     er.duplicateRecordError.matchResults.forEach(erMatchRec => {
    //                         erMatchRec.matchRecordIds.forEach(matchRec => {
    //                             message = message + ' ' + matchRec
    //                         })
    //                     })
    //                 }
    //             });
    //         } else if (error.body.output.fieldErrors != null && typeof error.body.output.errors === 'object') {
    //             Object.keys(error.body.output.fieldErrors).forEach(x => {
    //                 console.log(x);
    //                 error.body.output.fieldErrors[x].forEach(y => {
    //                     message = message + ' ' + y.errorCode;
    //                     message = message + ' ' + y.message;
    //                 })
    //             });
    //         }
    //     }
    //     //this.createLoggerEntry(message);
    //     return message
    // }
}