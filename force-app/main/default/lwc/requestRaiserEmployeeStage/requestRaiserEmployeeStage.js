import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import EMPLOYEE_OBJECT from '@salesforce/schema/Employee__c';
import { publish,subscribe,MessageContext } from 'lightning/messageService';
import REQUEST_RAISER_CHANNEL from '@salesforce/messageChannel/Request_Raiser__c';
import employeeCheck from '@salesforce/apex/requestRaiserCtrl.employeeCheck';
import { NavigationMixin } from 'lightning/navigation';
import ChartJS from '@salesforce/resourceUrl/chartjs_v280';
export default class RequestRaiserEmployeeStage extends LightningElement {
    @api recordId;
    @api objectApiName;
    @wire(MessageContext)
    messageContext;
    empIdNumber='';
    empName='';
    empPrimarySkill='';
    empSecondarySkill='';
    empEmail='';
    empExperience='';
    empComments='';

    priorEmpData;
    @api empData={};
    @api cerData={};
    @api cerReqData={};

    connectedCallback(){
        this.objectApiName = EMPLOYEE_OBJECT;
//        this.subscribeToMessageChannel();
    }

    handleNextPage(e) {
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
//                empData = {};
                this.empData.employeeIdNumber = this.empIdNumber;
                this.empData.employeeName = this.empName;
                this.empData.employeePrimarySkill = this.empPrimarySkill;
                this.empData.employeeSecondarySkill = this.empSecondarySkill;
                this.empData.employeeEmail = this.empEmail;
                this.empData.employeeExperience = this.empExperience;
                // this.empData.employeeComments = this.empComments;
                // const childEvent = new CustomEvent('empdataevent',{
                //     detail:{
                //        "employeeData":this.empData,
                //         "activePage":"2"
                //     }
                // });
                // this.dispatchEvent(childEvent);
                // const payload = {
                //     employeeData:this.empData
                // };
                // publish(this.messageContext, REQUEST_RAISER_CHANNEL,payload);
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__navItemPage',
                //     attributes: {
                //         apiName: 'Certifications',
                //     }
                // });   
            }
            console.log('end of employeecheck');
        })
        .catch(error=>{
            console.log(error);
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Error in Processing',
            //         message: error.message.body,
            //         variant: 'Error'
            //     })
            // );
        });
        console.log('end of handleNextPage');
    }

    // subscribeToMessageChannel(){
    //     this.subscription = subscribe(
    //         this.messageContext,
    //         REQUEST_RAISER_CHANNEL,
    //         (message)=>this.handleMessage(message)
    //     );
    // }

    // handleMessage(message){
    //     this.priorEmpData = this.empData;
    //     this.empData = message.employeeData;
    //     this.cerData = message.certificatonData;
    //     this.cerReqData = message.certificatonRequestData;
    //     if(message.employeeData!=null){
    //         this.empIdNumber = message.employeeData.empIdNumber;
    //         this.empName = message.employeeData.Name;
    //         this.empPrimarySkill = message.employeeData.empPrimarySkill;
    //         this.empSecondarySkill = message.employeeData.empSecondarySkill;
    //         this.empEmail = message.employeeData.empEmail;
    //         this.empComments = message.employeeData.empComments;
    //     }
    // }

    fieldValueChange(event){
        if(event.target.name=='Name') this.empIdNumber = event.target.value;
        if(event.target.name=='Employee_Name__c') this.empName = event.target.value;
        if(event.target.name=='Email__c') this.empEmail = event.target.value;
        if(event.target.name=='Primary_Skill__c') this.empPrimarySkill = event.target.value;
        if(event.target.name=='Secondary_Skill__c') this.empSecondarySkill = event.target.value;
        if(event.target.name=='Experience__c') this.empExperience = event.target.value;
        if(event.target.name=='Comments__c') this.empComments = event.target.value;
    }
}
