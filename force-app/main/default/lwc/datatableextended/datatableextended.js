import LightningDatatable from 'lightning/datatable';
import datatableextended from './datatableextended.html';
import datatableextendedComboBox from './datatableextendedcombobox.html';
import datatableextendedAccordian from './datatableextendedaccordian.html';

export default class Datatableextended extends LightningDatatable {
    static customTypes = {
        checkbox: {
            template: datatableextended,
			typeAttributes: ['isChecked', 'isRowEditable', 'columnName', 'userId', 'rowId'],
        },
        combobox: {
            template: datatableextendedComboBox,
			typeAttributes: [],
        },
        accordian: {
            template: datatableextendedAccordian,
            typeAttributes: [],
        }
    };
}