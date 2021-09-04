import { LightningElement, api, wire } from 'lwc';
import { deleteRecord, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_NAME_FIELD from '@salesforce/schema/Account.Owner.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

const actions = [
    { label: 'Delete Record', name: 'Delete_Record' },
    { label: 'Show Details', name: 'Show_Record' }
]
export default class Accountsearchresultlwc extends LightningElement {
    columns = [
        { label: 'Account Name', fieldName: 'accountName', type: 'text' },
        { label: 'Phone', fieldName: 'accountPhone', type: 'phone' },
        { label: 'Website', fieldName: 'website', type: 'url' },
        { label: 'Billing Address', fieldName: 'billingAddress' },
        { label: 'Annual Revenue', fieldName: 'annualrevenue', type: 'currency' },
        { label: 'Action', type: 'action', typeAttributes: { rowActions: actions } }
    ];
    @api searchResults;
    accRecordId;

    @wire(getRecord, { recordId: '$accRecordId', fields: [NAME_FIELD, INDUSTRY_FIELD], optionalFields: [PHONE_FIELD, OWNER_NAME_FIELD] })
    accountData({ error, data }) {
        if (data) {
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    }

    handleRowAction(event) {
        console.log(event);
        const actioName = event.detail.action.name;
        if (actioName === 'Delete_Record') {
            this.deleteRecordMethod(event);
        } else if (actioName === 'Show_Record') {
            this.accRecordId = event.detail.row.recordId;
            console.log(this.accountData);
        }
    }

    deleteRecordMethod(event) {
        deleteRecord(event.detail.row.recordId)
            .then(x => {
                this.searchResults = this.searchResults.filter(function(value, index, arr) {
                    return value.recordId != event.detail.row.recordId;
                });
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account Deleted Succesfully',
                        variant: 'success',
                        mode: 'sticky'
                    })
                );
            })
            .catch(e => {
                console.log(e);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error in record deletion. ' + e,
                        variant: 'error',
                        mode: 'sticky'
                    })
                );
            })
    }
}