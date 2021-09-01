import { LightningElement, api } from 'lwc';

export default class Accountsearchresultlwc extends LightningElement {
    columns = [
        { label: 'Account Name', fieldName: 'accountName' },
        { label: 'Phone', fieldName: 'accountPhone' },
        { label: 'Billing Address', fieldName: 'billingAddress' }
    ];
    @api searchResults;
}