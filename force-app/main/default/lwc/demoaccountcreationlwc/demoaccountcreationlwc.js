import { LightningElement, track, wire } from 'lwc';
import getAccountDetails from '@salesforce/apex/createNewAccountController.getAccountDetails';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getAccountDetailsByName from '@salesforce/apex/createNewAccountController.getAccountDetailsByName';
const columns = [
    {
        type: 'checkbox',
        fieldName: 'q1',
        label: 'Select',
        typeAttributes: { isChecked: { fieldName: 'isChecked' }, 
                          isRowEditable: { fieldName: 'isRowEditable' }, 
                          columnName: 'Select', 
                          rowId: { fieldName: 'id'}
                        },
		cellAttributes: { class: { fieldName: 'disabledClass' }}
    },
    {label: 'Account Type', type: 'combobox'},
    {label: 'Account name', fieldName: 'Name', type: 'text'},
    {label: 'Phone', fieldName: 'Phone', type: 'phone'},
    {label: 'Billing Address', fieldName: 'BillingAddress', type: 'email'},
    {label: 'Annual Revenue', fieldName:'AnnualRevenue', type:'currency', 
        cellAttributes:{ iconName: { fieldName: 'annualRevenueIcon' }, 
                         iconLabel: { fieldName: 'annualRevenueIconLabel' }, 
                         iconPosition: 'left', 
                         iconAlternativeText: 'Annual Revenue Icon',
                         class:{ fieldName: 'annualRevenueClass'}
                       }
    }
];

export default class Demoaccountcreationlwc extends LightningElement {
  @track columns = columns;
  @track accountName;
  @track phone;
  @track stateName;
  @track cityName;
  @track zipcode;
  @track countryName;
  @track accountsData=[];
  @track showAccountSearch=true;
  @track showAccountCreate=false;

  @wire(getAccountDetailsByName,{accountName : '$accountName' })
  DataReturnedFromApexClassReactiveProperty({error,data}){
    if(data){
      console.log(data);
    }
    else if(error){
      console.log(error);
    }
  }

  connectedCallback(){
      var dataTableStyle = document.createElement('style');
      dataTableStyle.innerHTML = `
                                    .redRow{
                                        background:red
                                    }
                                    .greenRow{
                                        background:green
                                    }
                                 `;
      document.head.appendChild(dataTableStyle);
  }

  handlecheckboxchange(event){
      console.log(event);
  }

  handleInputOnChange(event){
      if(event.target.name === 'accountName'){
        this.accountName = event.target.value;
      }
      else if(event.target.name === 'phone'){
        this.phone = event.target.value;
      }
  }

    handleStateOnChange(event){
        this.stateName = event.target.value;
    }

    handleCityOnChange(event){
        this.cityName = event.target.value;
    }

    handleZipCodeOnChange(event){
        this.zipcode = event.target.value;
    }

    handleCountryOnChange(event){
        this.countryName = event.target.value;
    }

    handleShowAccountCreationForm(event){
        this.showAccountCreate = true;
        this.showAccountSearch = false;
    }

    handlePreviousFromCreateStep(event){
        this.showAccountCreate = false;
        this.showAccountSearch = true;
        console.log(event.detail);
        this.accountName = event.detail.accountName;
        this.stateName = event.detail.stateName;
        this.cityName = event.detail.cityName;
        this.zipcode = event.detail.zipcode;
        this.countryName = event.detail.countryName;
    }

    handleHideCreateNewAccount(event){
        this.showAccountCreate = event.detail;
    }

    validateInputFields(){
        try{
        const isInputsCorrect = [
            ...this.template.querySelectorAll("lightning-input"),
          ]
          .reduce((isValid, inputField) => {
            if(!inputField.checkValidity()){
                if(inputField.name == 'accountName'){
                    inputField.setCustomValidity('Please enter the account name');
                }
                else if(inputField.name == 'phone'){
                    inputField.setCustomValidity('Please enter the phone number');
                }
            }
            inputField.reportValidity();
            return isValid && inputField.checkValidity();
          }, true);
          
          if (isInputsCorrect===false) { //if (!isInputsCorrect)
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Error",
                message: "Input the required fields",
                variant: "error",
              })
            );
            return isInputsCorrect;
          }
          return true;
        }
        catch(e){
            console.log(e);
        }
    }

    getAccountsData(event){
        if(this.validateInputFields()){
            getAccountDetails({accountName: this.accountName, phone: this.phone, stateName: this.stateName, 
                            cityName: this.cityName, zipcode: this.zipcode, countryName:this.countryName})
                        .then(result=>{
                            console.log(result);
                            //var accountsData = [];
                            this.accountsData = [];
                            result.forEach(x=>{
                                var data = {
                                    id: x.Id,
                                    Name: x.Name,
                                    Phone: x.Phone,
                                    BillingAddress: x.BillingAddress.street + ' ' + x.BillingAddress.city + ' ' + x.BillingAddress.state + ' ' + x.BillingAddress.postalCode + ' ' + x.BillingAddress.country,
                                    isChecked: 'true',
                                    isRowEditable: 'true',
                                    disabledClass: '',
                                    AnnualRevenue: x.AnnualRevenue,
                                    annualRevenueClass: x.AnnualRevenue > 50000? 'greenRow':'redRow',
                                    annualRevenueIcon: x.AnnualRevenue > 50000? 'utility:arrowup':'utility:arrowdown',
                                    annualRevenueIconLabel: x.AnnualRevenue > 50000? 'up':'down'
                                }
                                this.accountsData.push(data);
                            });
                            this.accountsData = [... this.accountsData];
                        })
                        .catch(error=>{
                            console.log(error);
                        })
                console.log('I got called first');
        }
    }
}