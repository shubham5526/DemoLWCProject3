import { LightningElement } from 'lwc';

export default class Createnewaccountlwc extends LightningElement {

    searchResultsParent;

    handleSearchResults(event) {
        console.log(event.detail);
        this.searchResultsParent = event.detail;
    }

    handleResetResults(event) {
        console.log(event.detail);
    }
}