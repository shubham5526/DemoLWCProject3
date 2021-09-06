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
    accountDetails;
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
        if (message != undefined && message.accountDetails != undefined) {
            this.accountDetails = message.accountDetails;
            this.accountName = message.accountDetails.accName;
            this.isVisible = true;
        } else {
            this.accountDetails = '';
            this.accountName = '';
            this.isVisible = false;
        }
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
        //const recordInput = { apiName: ACCOUNT_OBJECT.fieldApiName, fields };
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