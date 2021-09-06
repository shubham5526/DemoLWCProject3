import { LightningElement, api, wire } from 'lwc';
import { getRecordUi } from 'lightning/uiRecordApi';
import { getNavItems } from 'lightning/uiAppsApi';
import { getListInfoByName } from 'lightning/uiListsApi';
import FORM_FACTOR from '@salesforce/client/formFactor';

export default class Demohelloworld extends LightningElement {
    name;
    companyname;
    isVisible;
    @api nameOfProperty;

    @wire(getRecordUi, { recordIds: ['0015g00000OxfKOAAZ', '0015g00000NmdGTAAZ'], layoutTypes: ['Full'], modes: ['View'] })
    accountDataUi({ error, data }) {
        if (data) {
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    };

    @wire(getNavItems, {
        formFactor: 'Large',
        pageSize: 30,
    })
    NavItemsData({ error, data }) {
        if (data) {
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    };

    @wire(getListInfoByName, { objectApiName: 'Account', listViewApiName: 'United' })
    ListViewMetatData({ error, data }) {
        if (data) {
            console.log(data);
        } else if (error) {
            console.log(error);
        }
    };
    constructor() {
        super();
        this.isVisible = true;
        console.log('I am from the constructor');
    }

    connectedCallback() {
        console.log('I am from the connectedCallback');
    }

    rendered() {
        console.log('I am from the render');
    }

    renderedCallback() {
        console.log('I am from the renderedCallback');
    }

    disconnectedCallback() {
        console.log('I am from the disconnectedCallback');
    }

    errorCallback(error, stack) {
        console.log('I am from the errorCallback::error: ' + error + ' stack: ' + stack);
    }

    onNamechangeEvent(event) {
        try {
            console.log('name: ' + event.target.value);
            this.name = event.target.value;
        } catch (e) {
            console.log(e);
        }
    }

    onCompanyNamechangeEvent(event) {
        this.companyname = event.target.value;
    }

    hidetag(event) {
        this.isVisible = false;
    }

    showtag(event) {
        this.isVisible = true;

        this.dispatchEvent(new CustomEvent('nameofcustomevent', {
            detail: { accNam: 'accountName', accPhone: 'accountPhone' }
        }));
    }
}