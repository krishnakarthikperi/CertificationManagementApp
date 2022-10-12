public with sharing class CertificationLWCCtrl {
    public CertificationLWCCtrl() {    }

    @AuraEnabled(cacheable=true)
    public static List<Certification__c> getCertificationList(String certName){
        try {
            String searchKey = '%'+certName+'%';
            List<Certification__c> certificationList = [SELECT Id,Name,Certification_ID__c,Comments__c FROM Certification__c WHERE Name LIKE :searchKey ];
            return certificationList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
