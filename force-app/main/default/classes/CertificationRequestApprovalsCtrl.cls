public with sharing class CertificationRequestApprovalsCtrl {
    public CertificationRequestApprovalsCtrl() {    }

    public class CertificationRequestApproval{
        // public Certification_Request__c cerReq{get;set;}
        // public ProcessInstanceWorkitem piw{get;set;}
        public Object cerReq{get;set;}
        public Object piw{get;set;}
    }

    @AuraEnabled
//    public static List<CertificationRequestApproval> getPendingApprovals(){
    public static List<List<object>> getPendingApprovals(String key){
        try {
            String searchKey = '%'+key+'%';
            Map<Id,Certification_Request__c> cerReqMap =new Map<Id,Certification_Request__c>([SELECT Id,Name,Status__c,Comments__c,Due_Date__c,Email__c,Employee__c,Certification__r.Id,Certification__r.Name,Employee__r.Name,Employee__r.Employee_Name__c FROM Certification_Request__c WHERE Certification__r.Name LIKE :searchKey OR Employee__r.Employee_Name__c LIKE :searchKey OR Employee__r.Name LIKE :searchKey OR Name LIKE :searchKey]);
            List<ProcessInstanceWorkitem> workItems = [SELECT Id, ProcessInstanceId,ProcessInstance.TargetObjectId FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObjectId IN :cerReqMap.keySet()];
            List<List<Object>> craList = new List<List<Object>>();
            for(ProcessInstanceWorkitem workItem: workItems){
//                CertificationRequestApproval cra = new CertificationRequestApproval();
//                cra.cerReq = cerReqMap.get(workItem.ProcessInstance.TargetObjectId);
//                cra.piw = workItem;
//                craList.add(cra);
				List<Object> oL = new List<Object>();
				oL.add(cerReqMap.get(workItem.ProcessInstance.TargetObjectId));
                oL.add(workItem);
                craList.add(oL);
            }
            return craList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string processSingleApproval(Id workItemId,String action,String approverComments){
        try {
            Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
            req.setWorkitemId(workItemId);
            req.setAction(action);
            req.setComments(approverComments);
            Approval.ProcessResult result = Approval.process(req);
            if(result.isSuccess()) return 'PASS '+result.getInstanceStatus()+' '+result.getInstanceId();
            else return 'FAIL '+JSON.serialize(result.getErrors());
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
