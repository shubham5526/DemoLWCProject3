import LightningDatatable from 'lightning/datatable';
import datatableexcombobox from './datatableextendednew.html';
export default class Datatableextendednew extends LightningDatatable {
    static customTypes = {
        combobox: {
            template: datatableexcombobox,
            typeAttributes: ['recordType', 'recordTypeoptions'],
        }
    }
}