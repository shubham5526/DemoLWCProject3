import { LightningElement, api } from 'lwc';

export default class Datatableaccordian extends LightningElement {

    @api handleToggleSection(event){
        console.log(event);
    }
}