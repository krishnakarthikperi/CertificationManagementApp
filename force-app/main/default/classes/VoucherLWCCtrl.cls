public with sharing class VoucherLWCCtrl {
    public VoucherLWCCtrl() {    }

    @AuraEnabled
    public static List<Voucher__c> getVoucherList(String cerName){
        try {
            String searchKey = '%'+cerName+'%';
            List<Voucher__c> voucherList = [SELECT Id,Name,Certification__c,Certification__r.Name,Comments__c,Validity__c,Voucher_Cost__c,Active__c FROM Voucher__c WHERE Certification__r.Name LIKE :searchKey];
            return voucherList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
