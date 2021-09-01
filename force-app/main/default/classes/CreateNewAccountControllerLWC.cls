public with sharing class CreateNewAccountControllerLWC {
    @AuraEnabled
    public static List<Account> getAccounts(String accNameSearhKey, String billingState){
        try {
            System.debug('accNameSearhKey: '+ accNameSearhKey);
            accNameSearhKey = '%' + accNameSearhKey + '%';
            List<Account> accounts = new List<Account>();
            accounts = [SELECT ID, NAME FROM Account WHERE Name LIKE: accNameSearhKey OR BillingState=:billingState];
            return accounts;   
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
