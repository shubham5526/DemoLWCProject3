import { LightningElement } from 'lwc';

export default class Createnewaccountlwc extends LightningElement {

    handleSearchResults(event) {
        console.log(event.detail);
    }

    handleResetResults(event) {
        console.log(event.detail);
    }
}