import { LightningElement, wire, api, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import Account_Record_Created_CHANNEL from '@salesforce/messageChannel/Create_Account__c';

export default class Newaccountceatedtoday extends LightningElement {
    @api isVisible
    @track recordId
    @api budgetdate

    @wire(MessageContext)
    messageContext;
    
    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            Account_Record_Created_CHANNEL,
            (message) => this.showRecordId(message)
          );
        //this.subscribeToMessageChannel();
    }
    
    // subscribeToMessageChannel() {
        // this.subscription = subscribe(
        //     this.messageContext,
        //     Account_Record_Created_CHANNEL,
        //     (message) => this.showRecordId(message)
        //   );
    // }

    showRecordId(message) {
        this.isVisible = true;
        this.recordId = message.recordid;
        console.log(message);
    }
}