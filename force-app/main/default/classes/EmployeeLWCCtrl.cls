public with sharing class EmployeeLWCCtrl {
    public EmployeeLWCCtrl() {    }

    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeeList(String empName){
        try {
            String searchKey = '%'+empName+'%';
            List<Employee__c> employeeList = [SELECT Id,Name,Employee_Name__c,Email__c,Experience__c,(SELECT Name,Status__c,Certification__r.Id,Certification__r.Name from Certification_Requests__r) FROM Employee__c WHERE Employee_Name__c LIKE :searchKey ];
            return employeeList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Object> getEmployeeRelatedList(){
        try {
            return [SELECT Id,(SELECT Name,Certification__r.Name from Certification_Requests__r) FROM Employee__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
