import { LightningElement, wire } from 'lwc';
import accountDetailsMC from '@salesforce/messageChannel/Account_Details__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class Createnewaccountlwc extends LightningElement {

    searchResultsParent = [];
    accountName;
    @wire(MessageContext)
    messageContext;

    handleSearchResults(event) {
        try {
            this.enableDisableGetDetails(false);
            console.log(event.detail);
            this.searchResultsParent = [];
            this.accountName = event.detail.accountName;
            event.detail.results.forEach(x => {
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

    handlegetAccountDetails(event) {
        const dataToPublish = { accountDetails: this.accountName };
        publish(this.messageContext, accountDetailsMC, dataToPublish);
    }

    handleResetResults(event) {
        this.enableDisableGetDetails(true);
        console.log(event.detail);
        this.searchResultsParent = event.detail.results;
        const dataToPublish = { accountDetails: event.detail.accName };
        publish(this.messageContext, accountDetailsMC, dataToPublish);
    }

    enableDisableGetDetails(value) {
        var inputElements = this.template.querySelectorAll("lightning-button");
        inputElements.forEach(x => {
            if (x.name === 'accDetails') {
                x.disabled = value;
            }
        });
    }
}