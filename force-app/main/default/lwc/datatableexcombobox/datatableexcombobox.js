import { LightningElement, api } from 'lwc';

export default class Datatableexcombobox extends LightningElement {
    @api value = '';
    @api options = [];
    @api name;
    // get options1() {
    //     return [
    //         { label: 'Corporate', value: 'corporate' },
    //         { label: 'Individual', value: 'individual' },
    //     ];
    // }

    handleChange(event) {
        this.value = event.detail.value;
        this.dispatchEvent(new CustomEvent('handlecomboboxchange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: {
                    comboboxvalue: this.value,
                    recordId: this.name
                }
            }
        }));
    }

    handleonfocus(event) {
        this.template.querySelector("lightning-combobox").setAttribute("style", "height:10em");
    }

    handleonblur(event) {
        this.template.querySelector("lightning-combobox").setAttribute("style", "height:5em");
    }
}