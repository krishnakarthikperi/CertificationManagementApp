public with sharing class CertificationRequestApprovalRequestCtrl {
    public CertificationRequestApprovalRequestCtrl() {    }

    @AuraEnabled
    public static string singleRequest(Id recordId,String comments){
        try {
           Id userID = UserInfo.getUserId();
            // Id userID = '0055g00000F3fipAAB';
// Create an approval request for the Certification Request
            Approval.ProcessSubmitRequest req1 = new Approval.ProcessSubmitRequest();
            req1.setComments(comments);
            req1.setObjectId(recordId);

// Submit on behalf of a specific submitter
            req1.setSubmitterId(userId);

// Submit the record to specific process and skip the criteria evaluation
        req1.setProcessDefinitionNameOrId('Certification_Reqeust_Approver1');

// Submit the approval request for the account
        Approval.ProcessResult result = Approval.process(req1);
        if(result.isSuccess()){
            return result.getInstanceID()+' '+result.getInstanceStatus();
        }
        
        else{
            return JSON.serialize(result.getErrors()); 
        }

    } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string passFailUpdate(Id cerReqRecordId,String status){
        try {
//            Certification_Request__c cerReq = [SELECT Id,Status__c FROM Certification_Request__c]
            Certification_Request__c cerReq = new Certification_Request__c();
            cerReq.Id = cerReqRecordId;
            cerReq.Status__c = status;
            System.debug(cerReq);
            Database.SaveResult sr = Database.update(cerReq);
            if (sr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                System.debug('Successfully updated cerReq.  ID: ' + sr.getId());
                return 'PASS '+sr.getId();
            }   
            else {
                // Operation failed, so get all errors
                String errorString = '';                
                for(Database.Error err : sr.getErrors()) {
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('CerReq fields that affected this error: ' + err.getFields());
                    errorString = errorString+'\n'+ err.getStatusCode() + ': ' + err.getMessage();
                }
                return errorString;
            }             
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
