import {LightningElement, track, api} from 'lwc';

export default class Datatablecheckbox extends LightningElement {
    @api isChecked;
	@api rowid;
	@api isRowEditable;
	@api columnName;
	@api userId;

	@api handleCheckboxChange(event)
	{
		console.log(this.rowid);
		console.log(event.target.checked);
		this.dispatchEvent(new CustomEvent('checkboxchange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { checkboxvalue: event.target.checked,
						columnname: event.target.title,
						rowId: this.rowid
				 	  }
            }
        }));
	}

	// @api handleshowdetails(event)
	// {
	// 	console.log(this.rowId);
	// 	console.log(event.target.checked);
		
	// 	/*this.isChecked = event.target.checked;*/
	// 	this.dispatchEvent(new CustomEvent('showdetails', {
    //         composed: true,
    //         bubbles: true,
    //         cancelable: true,
    //         detail: {
    //             data: { userId: event.target.id.split('-')[0],
	// 					columnname: event.target.title }
    //         }
    //     }));
	// }

	@api diableCheckbox()
	{
		/*const element = this.template.querySelector('lightning-input');
		element.addAttribute('disabled');*/
	}
}