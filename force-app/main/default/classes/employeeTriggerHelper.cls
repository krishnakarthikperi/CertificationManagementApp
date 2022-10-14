public with sharing class employeeTriggerHelper {
    public employeeTriggerHelper() {}

    public static void beforeInsert(List<Employee__c> empList){
        Set<Id> newEmpIdSet = new Set<Id>();
        for(Employee__c emp:empList){
            newEmpIdSet.add(emp.Name);
        }
        if(newEmpIdSet.size()>0){
            List<Employee__c> existingEmpList = [SELECT Name FROM Employee__c WHERE Name IN:newEmpIdSet];
            for(Employee__c emp:empList){
                if(existingEmpList.contains(emp.Name)){
                    emp.addError('Employee ID already exists - apex');
                }
            }
        }
    }
}
