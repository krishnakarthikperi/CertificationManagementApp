trigger employeeTrigger on Employee__c (before insert) {
    employeeTriggerHelper.beforeInsert(Trigger.new);
}