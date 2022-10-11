public with sharing class EmployeeLWCCtrl {
    public EmployeeLWCCtrl() {    }

    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeeList(String empName){
        try {
            String searchKey = '%'+empName+'%';
            List<Employee__c> employeeList = [SELECT Id,Name,Employee_Name__c,Email__c,Experience__c FROM Employee__c WHERE Employee_Name__c LIKE :searchKey ];
            return employeeList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
