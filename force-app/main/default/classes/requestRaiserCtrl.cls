public with sharing class requestRaiserCtrl {
    public requestRaiserCtrl() {}

    @AuraEnabled
    public static string employeeCheck(String employeeIdNumber){
        try {
            Employee__c[] empS = [SELECT Id,(SELECT Id FROM Certification_Requests__r) FROM Employee__c WHERE Name =:employeeIdNumber AND Id IN (SELECT Employee__c FROM Certification_Request__c WHERE Status__c<>'Passed')];
            if(empS.size()!=0){
                return empS[0].Id;
            }
            else{
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string raiseCertificationRequest(
        String empName,
        String empIdNumber,
        String empEmail,
        String empPrimarySkill,
        String empSecondarySkill,
        String empExperience,
        String empComments,
        String cerName,
        String cerComments,
        String cerReqDueDate,
        String cerReqComments
    ){
        try {
            System.debug(empName);
 System.debug( empIdNumber);
 System.debug( empEmail);
 System.debug( empPrimarySkill);
 System.debug( empSecondarySkill);
 System.debug( empExperience);
 System.debug( empComments);
 System.debug( cerName);
 System.debug( cerComments);
 System.debug( cerReqDueDate);
 System.debug(cerReqComments);

            Employee__c emp = new Employee__c();
            emp.Name = empIdNumber;
            emp.Employee_Name__c = empName;
            emp.Email__c = empEmail;
            emp.Primary_Skill__c = empPrimarySkill;
            emp.Secondary_Skill__c = empSecondarySkill;
            emp.Experience__c = Decimal.valueOf(empExperience);
            emp.Comments__c = empComments;
            Employee__c[] empS = [SELECT Id FROM Employee__c WHERE Name =:empIdNumber ];
            if(empS.size()==0){
                Database.insert(emp);
            }
            else {
                emp.Id = empS[0].Id;
            }
            System.debug(emp);
            System.debug(emp.Id);
            Certification__c cer = new Certification__c();
            cer.Name = cerName;
            cer.Comments__c = cerComments;
            Certification__c[] cerS = [SELECT Id FROM Certification__c WHERE Name=:cerName];
            if(cerS.size()==0){
                Database.insert(cer);
            }
            else {
                cer.Id = cerS[0].Id;
            }
            Certification_Request__c cerReq = new Certification_Request__c();
            cerReq.Certification__c = cer.Id;
            cerReq.Employee__c = emp.Id;
            cerReq.Email__c = empEmail;
            cerReq.Due_Date__c = Date.parse(cerReqDueDate);
            cerReq.Comments__c = cerReqComments;
            Database.insert(cerReq);
            return emp.Id+' '+cer.Id+' '+cerReq.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
