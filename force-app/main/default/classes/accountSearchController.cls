public with sharing class accountSearchController {
    public accountSearchController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(string accountName, string billingState){
        accountName = '%' + accountName + '%';
        List<Account> accounts = [SELECT ID, NAME, WEBSITE, PHONE, BillingAddress, ANNUALREVENUE 
                                    FROM Account 
                                    WHERE 
                                        NAME LIKE:accountName OR
                                        BillingState =:billingState];
        System.debug('accounts: '+accounts);
        return accounts;
    }

    @AuraEnabled(cacheable=true)
    public static List<RecordType> getRecordTypes(string objName){
        try {
            return [SELECT ID, NAME FROM RecordType WHERE SobjectType =:objName];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static string updateAccounts(List<Account> accounts){
        try {
            System.debug('accounts: '+accounts);
            update accounts;
            return 'Accounts updated';
        } catch (Exception e) {
            System.debug('@@@@'+ e.getMessage());
            return e.getMessage();
            //throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string insertLogger(Logger__c log){
        insert log;
        return log.Id;
    }

    // @AuraEnabled(cacheable=true)
    // public static List<RecordType> getRecordTypesClone(string objName){
    //     try {
    //         return [SELECT ID, NAME FROM RecordType WHERE SobjectType =:objName];
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
}