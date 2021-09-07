import { LightningElement, wire } from 'lwc';
import accountDetailsMC from '@salesforce/messageChannel/Account_Details__c';
import { publish, MessageContext } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';
// import { getObjectInfo } from 'lightning/uiObjectInfoApi';
// import ACCOUNT_OBJECT from '@salesforce/schema/Account';

export default class Createnewaccountlwc extends NavigationMixin(LightningElement) {

    searchResultsParent = [];
    //accountName;
    accountDetails;
    @wire(MessageContext)
    messageContext;
    options = [];
    // @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    // accountObjInfo({ data, error }) {
    //     if (data) {
    //         console.log(data);
    //         Object.keys(data.recordTypeInfos)
    //             .forEach(x => {
    //                 if (data.recordTypeInfos[x].name != 'Master') {
    //                     var opData = {
    //                         label: data.recordTypeInfos[x].name,
    //                         value: data.recordTypeInfos[x].recordTypeId
    //                     }
    //                     this.options.push(opData);
    //                 }
    //             })
    //     } else if (error) {
    //         console.log(error);
    //     }
    // };

    errorCallback(error, stack) {
        console.log('errorcallback -parent' + error);
        console.log(stack);
    }

    handleSearchResults(event) {
        try {
            this.enableDisableGetDetails(false);
            console.log(event.detail);
            this.searchResultsParent = [];
            //this.accountName = event.detail.accDetails.accountName;
            this.accountDetails = event.detail.accDetails;
            event.detail.results.forEach(x => {
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: x.Id,
                        actionName: 'view'
                    }
                }).then(url => {
                    console.log(url);
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
                            (x.BillingAddress.country == undefined ? '' : x.BillingAddress.country),
                        accountURL: url,
                        accType: x.RecordType.Name
                            //options: this.options
                    }
                    this.searchResultsParent.push(data);
                    this.searchResultsParent = JSON.parse(JSON.stringify(this.searchResultsParent));
                });
            });
        } catch (e) {
            console.log(e);
        }
    }

    handlegetAccountDetails(event) {
        const dataToPublish = { accountDetails: this.accountDetails };
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