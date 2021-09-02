import { LightningElement, api } from 'lwc';

export default class Accountsearchresultlwc extends LightningElement {
    columns = [
        { label: 'Account Name', fieldName: 'accountName', type: 'text' },
        { label: 'Phone', fieldName: 'accountPhone', type: 'phone' },
        { label: 'Website', fieldName: 'website', type: 'url' },
        { label: 'Billing Address', fieldName: 'billingAddress' },
        { label: 'Annual Revenue', fieldName: 'annualrevenue', type: 'currency' }
    ];
    @api searchResults;
}