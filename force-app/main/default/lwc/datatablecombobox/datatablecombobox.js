import { LightningElement } from 'lwc';

export default class Datatablecombobox extends LightningElement {
    value = '';

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    handleonfocus(event){
        this.template.querySelector("lightning-combobox").setAttribute("style","height:15em");
    }

    handleonblur(event){
        this.template.querySelector("lightning-combobox").setAttribute("style","height:5em");
    }
}