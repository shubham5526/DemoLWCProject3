public with sharing class CreateNewAccountControllerLWC {
    @AuraEnabled
    public static List<Account> getAccounts(){
        try {
            List<Account> accounts = new List<Account>();
            accounts = [SELECT ID, NAME FROM Account];
            return accounts;   
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
