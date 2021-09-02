import { LightningElement } from 'lwc';

export default class Createnewaccountlwc extends LightningElement {

    searchResultsParent = [];

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

    handleResetResults(event) {
        console.log(event.detail);
    }
}