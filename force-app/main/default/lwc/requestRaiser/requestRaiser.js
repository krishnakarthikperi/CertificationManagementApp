import { api, LightningElement, track } from 'lwc';
import employeeCheck from '@salesforce/apex/requestRaiserCtrl.employeeCheck';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import raiseCertificationRequest from '@salesforce/apex/requestRaiserCtrl.raiseCertificationRequest';


export default class RequestRaiser extends LightningElement {
    empData={
        empName:'',
        empIdNumber:'',
        empEmail:'',
        empPrimarySkill:'',
        empSecondarySkill:'',
        empExperience:'0',
        empComments:''
    };
    cerData={
        cerName:'',
        cerComments:'',
       };
    cerReqData={
        cerReqDueDate:'',
        cerReqComments:''       
    };
    @track activePage;

    page1=true;
    page2=false;
    page3=false;

    setActivePage(a){
        if(a=="1"){
            this.page1=true;
            this.page2=false;
            this.page3=false;
        }
        else if(a=="2"){
            this.page1=false;
            this.page2=true;
            this.page3=false;
        }
        else if(a=="3"){
            this.page1=false;
            this.page2=false;
            this.page3=true;
        }
    }
    empFieldValueChange(event){
        if(event.target.name=='Name') this.empData.empIdNumber = event.target.value;
        if(event.target.name=='Employee_Name__c') this.empData.empName = event.target.value;
        if(event.target.name=='Email__c') this.empData.empEmail = event.target.value;
        if(event.target.name=='Primary_Skill__c') this.empData.empPrimarySkill = event.target.value;
        if(event.target.name=='Secondary_Skill__c') this.empData.empSecondarySkill = event.target.value;
        if(event.target.name=='Experience__c') this.empData.empExperience = event.target.value;
        if(event.target.name=='Comments__c') this.empData.empComments = event.target.value;
    }
    handleGoToCertificationPage(e) {
        employeeCheck({employeeIdNumber:this.empIdNumber})
        .then(data=>{
            if(data!=null){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Cannot Proceed',
                        message: 'Employee has pending certification requests!',
                        variant: 'Warning'
                    })
                );
            }
            else if(data==null){
                console.log('good to proceed with',this.empData);
                this.setActivePage("2");
            }
        })
        .catch(error=>{
            console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error in Processing',
                    message: error.message.body,
                    variant: 'Error'
                })
            );
        });
    }
    handleGoToEmployeePage(){
        this.setActivePage("1");
    }

    cerFieldValueChange(event){
        if(event.target.name=='Name') this.cerData.cerName = event.target.value;
        if(event.target.name=='Comments__c') this.cerData.cerComments = event.target.value;
    }
    handleGoToCertificationRequestPage(){
        this.setActivePage("3");
    }
    
    cerReqFieldValueChange(event){
        if(event.target.name=='Due_Date__c') this.cerReqData.cerReqDueDate = event.target.value;
        if(event.target.name=='Comments__c') this.cerReqData.cerReqComments = event.target.value;
        this.cerReqData.cerReqEmail = this.empData.empMail;
    }
    
    handleReset(){
        this.setActivePage("1");
        this.empData={};
        this.cerData={};
        this.cerReqData={};
    }

    dateFormatter(date){
        let arr = date.split('-');
        return arr[1]+'/'+arr[2]+'/'+arr[0];
    }
    handleSubmit(){
        console.log(
            this.empData.empName,
            this.empData.empIdNumber,
            this.empData.empEmail,
            this.empData.empPrimarySkill,
            this.empData.empSecondarySkill,
            this.empData.empExperience,
            this.empData.empComments,
            this.cerData.cerName,
            this.cerData.cerComments,
            this.cerReqData.cerReqDueDate,
            this.cerReqData.cerReqComments,
            this.dateFormatter(this.cerReqData.cerReqDueDate)    
        )
        raiseCertificationRequest({
            empName:this.empData.empName,
            empIdNumber:this.empData.empIdNumber,
            empEmail:this.empData.empEmail,
            empPrimarySkill:this.empData.empPrimarySkill,
            empSecondarySkill:this.empData.empSecondarySkill,
            empExperience:this.empData.empExperience,
            empComments:this.empData.empComments,
            cerName:this.cerData.cerName,
            cerComments:this.cerData.cerComments,
            cerReqDueDate:this.dateFormatter(this.cerReqData.cerReqDueDate),
            cerReqComments:this.cerReqData.cerReqComments    
        })
        .then(data=>{
            console.log(data);
            this.handleGoToEmployeePage();
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Request Created',
                    message: 'Certification Request is created for '+this.empData.empName,
                    variant: 'Success'
                })
            );
            this.resetData();
        })
        .catch(error=>{
            console.log(error);
            this.handleGoToEmployeePage();
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error in Processing',
                    message: error.message.body,
                    variant: 'Error'
                })
            );
        });
    }

    resetData(){
        this.empData={
            empName:'',
            empIdNumber:'',
            empEmail:'',
            empPrimarySkill:'',
            empSecondarySkill:'',
            empExperience:'0',
            empComments:''
        };
        this.cerData={
            cerName:'',
            cerComments:'',
           };
        this.cerReqData={
            cerReqDueDate:'',
            cerReqComments:''       
        };
    
    }

}