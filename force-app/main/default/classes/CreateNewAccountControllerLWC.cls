public with sharing class CreateNewAccountControllerLWC {
    @AuraEnabled
    public static List<Account> getAccounts(String accNameSearhKey, String billingState){
        try {
            System.debug('accNameSearhKey: '+ accNameSearhKey);
            accNameSearhKey = '%' + accNameSearhKey + '%';
            List<Account> accounts = new List<Account>();
            accounts = [SELECT ID, NAME, Phone, Website, AnnualRevenue, BillingAddress, RecordTypeId, RecordType.Name 
                        FROM Account WHERE Name LIKE: accNameSearhKey OR BillingState=:billingState];
            return accounts;   
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void createLogger(Logger__c log){
        try {
            insert log;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
