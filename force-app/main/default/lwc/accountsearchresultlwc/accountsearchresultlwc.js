import { LightningElement, api, wire } from 'lwc';
import { deleteRecord, getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import Id_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_NAME_FIELD from '@salesforce/schema/Account.Owner.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import AnnualRevenue_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import Employees_FIELD from '@salesforce/schema/Account.NumberOfEmployees';
import SIC_FIELD from '@salesforce/schema/Account.Sic';
import AccountNumber_FIELD from '@salesforce/schema/Account.AccountNumber';
import BillingAddress_FIELD from '@salesforce/schema/Account.BillingAddress';
import BillingCity_FIELD from '@salesforce/schema/Account.BillingCity';

const actions = [
    { label: 'Delete Record', name: 'Delete_Record' },
    { label: 'Show Details', name: 'Show_Record' }
]
export default class Accountsearchresultlwc extends LightningElement {
    options = [
        { label: 'Corporate', value: 'Corporate' },
        { label: 'Individual', value: 'Individual' },
    ];
    columns = [
        { label: 'Account Type', type: 'combobox', typeAttributes: { recordType: { fieldName: 'accType' }, recordTypeoptions: this.options } },
        { label: 'Account Name', fieldName: 'accountURL', type: 'url', editable: true, typeAttributes: { label: { fieldName: 'accountName' }, target: '_blank' } },
        { label: 'Phone', fieldName: 'accountPhone', type: 'phone', editable: true },
        { label: 'Website', fieldName: 'website', type: 'url' },
        { label: 'Billing Address', fieldName: 'billingAddress' },
        { label: 'Annual Revenue', fieldName: 'annualrevenue', type: 'currency', editable: true },
        { label: 'Action', type: 'action', typeAttributes: { rowActions: actions } }
    ];
    @api searchResults;
    accRecordId;
    draftValues;
    showDetails = false;
    selectedAccDetails;
    accName;
    Industry;
    employees;
    sic;
    accountNumber;
    phone;
    owner;
    recFormFields = [NAME_FIELD, INDUSTRY_FIELD, Employees_FIELD, SIC_FIELD, AccountNumber_FIELD, PHONE_FIELD, OWNER_NAME_FIELD];

    @wire(getRecord, {
        recordId: '$accRecordId',
        fields: [NAME_FIELD, INDUSTRY_FIELD, Employees_FIELD, SIC_FIELD, AccountNumber_FIELD],
        optionalFields: [PHONE_FIELD, OWNER_NAME_FIELD]
    })
    accountData({ error, data }) {
        if (data) {
            console.log(data);
            this.selectedAccDetails = data.fields;
            this.accName = this.selectedAccDetails.Name.value;
            this.Industry = this.selectedAccDetails.Industry.value;
            this.employees = this.selectedAccDetails.NumberOfEmployees.value;
            this.sic = this.selectedAccDetails.Name.value;
            this.accountNumber = this.selectedAccDetails.Sic.value;
            this.phone = this.selectedAccDetails.Phone.value;
            this.owner = this.selectedAccDetails.Owner.displayValue;
        } else if (error) {
            console.log(error);
        }
    }

    renderedCallback() {
        console.log('I am from the renderedCallback');
    }

    updateAccountDetails(event) {
        event.detail.draftValues.forEach(x => {
            var fields = {};
            fields[Id_FIELD.fieldApiName] = x.recordId;
            if (x.accountName !== undefined) {
                fields[NAME_FIELD.fieldApiName] = x.accountName;
            }
            if (x.accountPhone !== undefined) {
                fields[PHONE_FIELD.fieldApiName] = x.accountPhone;
            }
            if (x.annualrevenue !== undefined) {
                fields[AnnualRevenue_FIELD.fieldApiName] = x.annualrevenue;
            }
            const recordInput = { fields };
            updateRecord(recordInput)
                .then(updatedRecord => {

                    console.log(updatedRecord);
                    var initailSearchResults = JSON.parse(JSON.stringify(this.searchResults));
                    initailSearchResults.forEach(item => {
                        if (item.recordId === x.recordId) {
                            if (x.accountName !== undefined) {
                                item.accountName = x.accountName;
                            }
                            if (x.accountPhone !== undefined) {
                                item.accountPhone = x.accountPhone;
                            }
                            if (x.annualrevenue !== undefined) {
                                item.annualrevenue = x.annualrevenue;
                            }
                        }
                    });
                    this.draftValues = [];
                    this.searchResults = JSON.parse(JSON.stringify(initailSearchResults));
                    console.log(this.searchResults);
                })
                .catch(e => {
                    console.log(e);
                })
        });
    }

    handleRowAction(event) {
        console.log(event);
        const actioName = event.detail.action.name;
        if (actioName === 'Delete_Record') {
            this.deleteRecordMethod(event);
        } else if (actioName === 'Show_Record') {
            this.accRecordId = event.detail.row.recordId;
            console.log(this.accountData);
            this.showDetails = true;
        }
    }

    handleClickClose(event) {
        this.showDetails = false;
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