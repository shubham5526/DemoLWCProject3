import { LightningElement } from 'lwc';
import getAccountDetails from '@salesforce/apex/CreateNewAccountControllerLWC.getAccounts';

export default class Acountsearchlwc extends LightningElement {
    accName;
    accPhone;
    billingStreet;
    billingCity;
    billingState;
    billingZipcode;
    showLoader = false;

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
        this.clearFields();
        var resetData = new CustomEvent('resetsearchresults', {
            detail: {
                results: [],
                accDetails: {
                    accName: this.accName,
                    accPhone: this.accPhone,
                    billingStreet: this.billingStreet,
                    billingCity: this.billingCity,
                    billingState: this.billingState,
                    billingZipcode: this.billingZipcode
                }
            }
        });
        this.dispatchEvent(resetData);
    }

    clearFields() {
        this.accName = '';
        this.accPhone = '';
        this.billingStreet = '';
        this.billingCity = '';
        this.billingState = '';
        this.billingZipcode = '';
    }

    handleSearch(event) {
        this.showLoader = true;
        const isInputsCorrect = [...this.template.querySelectorAll("lightning-input")]
            .reduce((validSoFar, inputField) => {
                if (inputField.label === "Name" && !inputField.checkValidity()) {
                    inputField.setCustomValidity('Account Name is required');
                } else if (inputField.label === "State" && !inputField.checkValidity()) {
                    inputField.setCustomValidity('State Name is required');
                }
                inputField.reportValidity();
                inputField.setCustomValidity('');
                return validSoFar && inputField.checkValidity();
            }, true);
        console.log('isInputsCorrect: ' + isInputsCorrect);
        // alert(isInputsCorrect.checkValidity());
        // if (!isInputsCorrect.checkValidity()) {
        //     isInputsCorrect.setCustomValidity('Account Name is required');
        //     isInputsCorrect.reportValidity();
        //     isInputsCorrect.setCustomValidity('');
        // }
        if (isInputsCorrect) {
            console.log('Initiate the search');
            getAccountDetails({ accNameSearhKey: this.accName, billingState: this.billingState })
                .then(results => {
                    console.log('Apex Response Received');
                    console.log(results);
                    this.showLoader = false;
                    var sendData = new CustomEvent('getsearchresults', {
                        detail: {
                            results: results,
                            accDetails: {
                                accName: this.accName,
                                accPhone: this.accPhone,
                                billingStreet: this.billingStreet,
                                billingCity: this.billingCity,
                                billingState: this.billingState,
                                billingZipcode: this.billingZipcode
                            }
                        }
                    });
                    this.dispatchEvent(sendData);
                })
                .catch(error => {
                    console.log(results);
                })
            console.log('I got called befor Apex Response');
        }
    }
}