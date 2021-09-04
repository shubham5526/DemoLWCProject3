import { LightningElement, api } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

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

    handleRowAction(event) {
        console.log(event);
        const actioName = event.detail.action.name;
        if (actioName === 'Delete_Record') {
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
}