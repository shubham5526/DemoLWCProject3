import { LightningElement } from 'lwc';
import getAccountDetails from '@salesforce/apex/CreateNewAccountControllerLWC.getAccounts';

export default class Acountsearchlwc extends LightningElement {
    accName;
    accPhone;
    billingStreet;
    billingCity;
    billingState;
    billingZipcode;

    handleAccName(event) {
        this.accName = event.target.value;
    }

    handleAccPhone(event) {
        this.accPhone = event.target.value;
    }

    handleBillStreet(event) {
        this.billingStreet = event.target.value;
    }

    handleBillCity(event) {
        this.billingCity = event.target.value;
    }

    handleBillState(event) {
        this.billingState = event.target.value;
    }

    handleBillZipcode(event) {
        this.billingZipcode = event.target.value;
    }

    handleReset(event) {
        var resetData = new CustomEvent('resetsearchresults', {
            detail: ''
        });
        this.dispatchEvent(resetData);
    }

    handleSearch(event) {
        console.log('Initiate the search');
        getAccountDetails({ accNameSearhKey: this.accName, billingState: this.billingState })
            .then(results => {
                console.log('Apex Response Received');
                console.log(results);
                var sendData = new CustomEvent('getsearchresults', {
                    detail: { results: results, accountName: this.accName }
                });
                this.dispatchEvent(sendData);
            })
            .catch(error => {
                console.log(results);
            })
        console.log('I got called befor Apex Response');
    }
}