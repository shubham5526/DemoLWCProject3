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

export default class Accountdetailslwc extends LightningElement {
    accountName;
    messageSubscriber;
    @api isVisible;
    //@api year;

    // constructor() {
    //     super();
    //     this.isVisible = true;
    // }

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
        this.accountName = message.accountDetails;
    }

    createNewAccount() {
        //syntax
        //fields[apiNameofTheField] = 'Value'
        const fields = {};
        fields['Name'] = this.accountName;
        fields[BillingStreet_FIELD.fieldApiName] = 'Street 101';
        fields[BillingState_FIELD.fieldApiName] = 'New York';
        fields[BillingCity_FIELD.fieldApiName] = 'New York';
        fields[BillingPostalCode_FIELD.fieldApiName] = '73006';
        fields[BillingCountry_FIELD.fieldApiName] = 'USA';
        const recordInput = { apiName: 'Account', fields };
        createRecord(recordInput)
            .then(x => {
                console.log('Account Created: ' + x);
            })
            .catch(e => {
                console.log('Account Creation Error: ' + e);
            })
    }
}