public class createNewAccountController {
    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountDetails(string accountName, string phone, string stateName, string cityName, string zipcode, string countryName){
        accountName = '%' + accountName + '%';
        List<Account> accList = [SELECT ID, Name, BillingAddress, Phone, AnnualRevenue 
                                    FROM Account WHERE Name LIKE :accountName];
        System.debug('@@accList:' + accList.size());
        System.debug('@@accList:' + accList);
        return accList;
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountDetailsByName(string accountName){
        accountName = '%' + accountName + '%';
        List<Account> accList = [SELECT ID, Name, BillingAddress, Phone 
                                    FROM Account WHERE Name LIKE :accountName];
        System.debug('@@accList:' + accList.size());
        System.debug('@@accList:' + accList);
        return accList;
    }

    @AuraEnabled(Cacheable=true)
    public static List<RecordType> getAccountRecordTypes(){
        List<RecordType> recordTypes = [SELECT ID, NAME FROM RecordType WHERE SobjectType = 'Account'];
        return recordTypes;
    }

    @AuraEnabled
    public static string insertLogger(Logger__c log){
        insert log;
        return log.Id;
    }
}