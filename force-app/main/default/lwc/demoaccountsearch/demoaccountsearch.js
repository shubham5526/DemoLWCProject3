import { LightningElement, track } from 'lwc';

export default class Demoaccountsearch extends LightningElement {
    @track inputValue='Demo Value';
    @track showTemplate;
    @track value = '';
    dataToIterate = [{
        Id: 1,
        AccountName: 'Test Account 1'
    },
    {
        Id: 1,
        AccountName: 'Test Account 2'
    },
    {
        Id: 1,
        AccountName: 'Test Account 3'
    }];

    get options() {
        return [
            { label: 'Show', value: 'true' },
            { label: 'Hide', value: 'false' },
        ];
    }

    handleChange(event){
        this.inputValue = event.target.value;
    }

    handleRadioSelection(event){
        if(event.target.value == 'true'){
            this.showTemplate = true;
        }

        else if(event.target.value == 'false'){
            this.showTemplate = false;
        }
    }
}