public with sharing class CertificationRequestLWCCtrl {
    public CertificationRequestLWCCtrl() {}

    @AuraEnabled
    public static List<Certification_Request__c> getCertificatioRequestList(String key){
        try {
            String searchKey = '%'+key+'%';
            List<Certification_Request__c> certificationRequestList = [SELECT Id,Name,Status__c,Comments__c,Due_Date__c,Email__c,Employee__c,Certification__r.Id,Certification__r.Name,Employee__r.Name,Employee__r.Employee_Name__c,Voucher__r.Name,Voucher__r.Voucher_Cost__c,Voucher__r.Validity__c FROM Certification_Request__c WHERE Employee__r.Employee_Name__c LIKE :searchKey OR Certification__r.Name LIKE :searchKey];
            return certificationRequestList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
