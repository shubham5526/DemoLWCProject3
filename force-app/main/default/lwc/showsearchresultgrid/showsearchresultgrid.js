import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import Name_Field from '@salesforce/schema/Account.Name';
import Phone_Field from '@salesforce/schema/Account.Phone';
import Website_Field from '@salesforce/schema/Account.Website';
import Id_Field from '@salesforce/schema/Account.Id';
import updateAccounts from '@salesforce/apex/accountSearchController.updateAccounts'

const actions = [
    {label:'Update Record', name:'Update_Record'},
    {label:'Delete Record', name:'Delete_Record'}
]

const columns = [
    { label: 'Select', type: 'checkbox', fieldName: 'select', typeAttributes:{rowId: {fieldName: 'id'}, columnName: 'Click to select the row'}},
    { label: 'Account Name', editable: true, fieldName: 'name', sortable: true, cellAttributes:{ iconName: 'standard:account', iconPosition: 'left' }},
    { label: 'Phone', editable: true, fieldName: 'phone', type: 'phone' },
    { label: 'Website', editable: true, fieldName: 'website', type: 'url' },
    { label: 'Revenue', fieldName: 'revenue', type: 'currency', cellAttributes:{iconName: {fieldName: 'revenueIcon'}, iconPosition:'left',class: {fieldName: 'revenueClass'}}  },
    { label: 'Address', fieldName: 'address', type: 'text' },
    { label: 'Action', type: 'action', typeAttributes: {rowActions:actions }}
];
export default class Showsearchresultgrid extends LightningElement {
    columns = columns;
    actions = actions;
    @api searchResults=[];
    sortedBy;
    sortedDirection;

    updateColumnSorting(event) {
        var fieldName = event.detail.fieldName;
        var sortDirection = event.detail.sortDirection;
        // assign the latest attribute with the sorted column fieldName and sorted direction
        this.sortedBy = fieldName;
        /*if(this.sortedDirection=='asc'){
            sortDirection = 'desc';
        }
        else{
            sortDirection = 'asc'
        }*/
        this.sortedDirection = sortDirection;
        this.sortData(fieldName, sortDirection);
   }

   sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.searchResults));

    let keyValue = (a) => {
        return a[fieldname];
    };

    let isReverse = direction === 'asc' ? 1 : -1;

    parseData.sort((x, y) => {
        x = keyValue(x) ? keyValue(x) : ''; 
        y = keyValue(y) ? keyValue(y) : '';

        return isReverse * ((x > y) - (y > x));
    });

    this.searchResults = parseData;
}

    handleGridCheckboxChange(event){
        console.log(event);
    }

    handleSave(event){
        console.log(event.detail.draftValues);
        var accountsData = [];
        event.detail.draftValues.forEach(x=>{
            var account = {};
            account[Name_Field.fieldApiName] = x.name;
            account[Website_Field.fieldApiName] = x.website;
            account[Phone_Field.fieldApiName] = x.phone;
            account[Id_Field.fieldApiName] = x.id;
            accountsData.push(account);
        });
        updateAccounts({accounts: accountsData})
        .then(x=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Accounts Updated Succesfully',
                    variant: 'success'
                })
            );
        })
        .catch(e=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error in updating records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        })
    }

    handleRowAction(event){
        console.log(event);
        const actioName = event.detail.action.name;
        if(actioName === 'Update_Record'){
            this.updateRow(event.detail.row);
        }
        else if(actioName === 'Delete_Record'){
            this.deleteRow(event.detail.row["id"], event.detail.row);
        }
    }

    updateRow(row){
        const fields = {};
        fields[Name_Field.fieldApiName] = row['name'];
        fields[Website_Field.fieldApiName] = row['website'];
        fields[Phone_Field.fieldApiName] = row['phone'];
        fields[Id_Field.fieldApiName] = row['id'];
        var Record = {
            "fields": fields
        };
        updateRecord(Record)
                    .then(() => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Account Updated Succesfully',
                                variant: 'success'
                            })
                        );
                    })
                    .catch(error => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error creating record',
                                message: error.body.message,
                                variant: 'error'
                            })
                        );
                    });
    }

    deleteRow(id, row){
         deleteRecord(id).then(result=>{
            this.searchResults = this.searchResults.filter(function(value,index,arr){
                return value.id != id;
            });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account Deleted Succesfully',
                    variant: 'success'
                })
            );
        })
        .catch(error=>{
            console.log('Record Deletion Error' + error);
        })
    }
}