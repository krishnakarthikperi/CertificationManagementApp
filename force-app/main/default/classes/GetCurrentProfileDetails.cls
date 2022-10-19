public with sharing class GetCurrentProfileDetails {
    public GetCurrentProfileDetails() {}

    @AuraEnabled
    public static string getProfileName(){
        try {
            List<Profile> PROFILE = [SELECT Id, Name FROM Profile WHERE Id=:userinfo.getProfileId() LIMIT 1];
            String MyProfileName = PROFILE[0].Name;
            return MyProfileName;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
