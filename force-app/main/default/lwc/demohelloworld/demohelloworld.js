import { LightningElement, api } from 'lwc';

export default class Demohelloworld extends LightningElement {
    name;
    companyname;
    isVisible;
    @api nameOfProperty;

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