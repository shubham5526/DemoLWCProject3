import { LightningElement, wire, api } from 'lwc';
import accountDetailsMC1 from '@salesforce/messageChannel/Account_Details__c';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';

export default class Accountdetailslwc extends LightningElement {
    dataFromMessageChannel;
    messageSubscriber;
    @api isVisible;
    @api year;

    constructor() {
        super();
        this.isVisible = true;
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
        this.dataFromMessageChannel = message.accountDetails;
    }

}