import { LightningElement, wire, api } from 'lwc';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c';
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
export default class Moreaccountinfo extends LightningElement {
    @api isVisible;
    subscribtionmsg = null;
    accountName;
    jsonData;
    imgURL;
    domain;
    legalName;
    greeting = 'World';

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (this.subscribtionmsg == null || this.subscribtionmsg == undefined) {
            this.subscribtionmsg = subscribe(this.messageContext,
                moreInfoChannel,
                (msg) => this.getAccountDetails(msg));
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscribtionmsg);
        this.subscribtionmsg = null;
    }

    getAccountDetails(msg) {
        console.log(msg);
        this.isVisible = msg.isVisible;
        this.accountName = msg.accountName;
        this.fetchCompanyWebSite(this.accountName);
    }

    fetchCompanyWebSite(companyName) {
        fetch('https://company.clearbit.com/v1/domains/find?name=' + companyName, {
                method: "GET",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Authorization": "Bearer sk_6b6f44b87111aeb5f86ec595af49194c"
                }
            })
            .then((response) => {
                return response.json(); // returning the response in the form of JSON
            })
            .then((jsonResponse) => {
                console.log('jsonResponse ===> ' + JSON.stringify(jsonResponse));
                this.fetchCompanyDetails(jsonResponse.domain);
            })
            .catch(error => {
                console.log('callout error 1 ===> ' + error);
            })
    }

    fetchCompanyDetails(domain) {
        fetch('https://company.clearbit.com/v2/companies/find?domain=' + domain, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer sk_6b6f44b87111aeb5f86ec595af49194c"
                }
            })
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                this.imgURL = jsonResponse.logo;
                this.domain = jsonResponse.domain;
                this.legalName = jsonResponse.legalName;
                this.jsonData = JSON.stringify(jsonResponse);
                console.log('jsonResponse ===> ' + JSON.stringify(jsonResponse));
            })
            .catch(error => {
                console.log('callout error 2 ===> ' + error);
            })
    }
}