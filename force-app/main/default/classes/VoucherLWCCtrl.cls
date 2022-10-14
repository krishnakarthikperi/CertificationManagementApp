public with sharing class VoucherLWCCtrl {
    public VoucherLWCCtrl() {    }

    @AuraEnabled
    public static List<Voucher__c> getVoucherList(String cerName){
        try {
            String searchKey = '%'+cerName+'%';
            List<Voucher__c> voucherList = [SELECT Id,Name,Certification__c,Certification__r.Name,Certification__r.Comments__c,Comments__c,Validity__c,Voucher_Cost__c,Active__c,(SELECT Id,Name,Comments__c,Due_Date__c,Status__c FROM Certification_Requests__r) FROM Voucher__c WHERE Certification__r.Name LIKE :searchKey];
            return voucherList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
