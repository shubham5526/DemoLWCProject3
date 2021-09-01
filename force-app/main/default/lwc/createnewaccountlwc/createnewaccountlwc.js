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
                    accountName: x.Name
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