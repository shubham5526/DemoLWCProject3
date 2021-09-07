import { LightningElement } from 'lwc';

export default class Datatableexcombobox extends LightningElement {
    value = 'corporate';

    get options() {
        return [
            { label: 'Corporate', value: 'corporate' },
            { label: 'Individual', value: 'individual' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}