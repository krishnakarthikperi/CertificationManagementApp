public with sharing class CMAChartDataLWCCtrl {
    public CMAChartDataLWCCtrl() {}

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getPassFail(){
        try {
            List<AggregateResult> result = [SELECT Count(ID) Cnt,Certification__r.Name,Status__c FROM Certification_Request__c WHERE Status__c IN ('Passed','Failed') GROUP BY Certification__r.Name,Status__c];
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<AggregateResult> getCertifiedResources(){
        try {
            List<AggregateResult> result =[SELECT Count(ID) Cnt,Certification__r.Name FROM Certification_Request__c WHERE Status__c IN ('Passed') GROUP BY Certification__r.Name,Status__c];
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static List<AggregateResult> getActiveVouchers(){
        try {
            List<AggregateResult> result =[SELECT Count(ID) Cnt,Certification__r.Name FROM Voucher__c WHERE Active__c = true GROUP BY Certification__r.Name];
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<AggregateResult> getCertificationRequests(){
        try {
            List<AggregateResult> result =[SELECT Count(ID) Cnt,Certification__r.Name,Status__c FROM Certification_Request__c GROUP BY Certification__r.Name,Status__c];
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<AggregateResult> getCertifications(){
        try {
            List<AggregateResult> result =[SELECT Count(ID) Cnt,Certification__r.Name FROM Certification_Request__c GROUP BY Certification__r.Name];
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
