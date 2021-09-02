import { LightningElement, wire } from 'lwc';
import accountDetailsMC from '@salesforce/messageChannel/Account_Details__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class Createnewaccountlwc extends LightningElement {

    searchResultsParent = [];

    @wire(MessageContext)
    messageContext;

    handleSearchResults(event) {
        try {
            console.log(event.detail);
            this.searchResultsParent = [];
            event.detail.forEach(x => {
                var data = {
                    recordId: x.Id,
                    accountName: x.Name,
                    accountPhone: x.Phone,
                    website: x.Website,
                    annualrevenue: x.AnnualRevenue,
                    billingAddress: (x.BillingAddress.street == undefined ? '' : x.BillingAddress.street) + ' ' +
                        (x.BillingAddress.city == undefined ? '' : x.BillingAddress.city) + ' ' +
                        (x.BillingAddress.state == undefined ? '' : x.BillingAddress.state) + ' ' +
                        (x.BillingAddress.postalCode == undefined ? '' : x.BillingAddress.postalCode) + ' ' +
                        (x.BillingAddress.country == undefined ? '' : x.BillingAddress.country)
                }
                this.searchResultsParent.push(data);
            });
        } catch (e) {
            console.log(e);
        }
    }

    handlePublishMessage(event) {
        const dataToPublish = { accountDetails: 'Published Message' };
        publish(this.messageContext, accountDetailsMC, dataToPublish);
    }

    handleResetResults(event) {
        console.log(event.detail);
    }
}