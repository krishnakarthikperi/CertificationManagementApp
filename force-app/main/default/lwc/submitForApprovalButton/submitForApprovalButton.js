import { LightningElement,track,api } from 'lwc';
import singleRequest from '@salesforce/apex/CertificationRequestApprovalRequestCtrl.singleRequest';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import passFailUpdate from '@salesforce/apex/CertificationRequestApprovalRequestCtrl.passFailUpdate'; 
import TickerSymbol from '@salesforce/schema/Account.TickerSymbol';

export default class SubmitForApprovalButton extends LightningElement {
    @api cerReqId;  //not getting data from parent - unable to debug
    @api cerReqObject;
    @api status;
    showSubmitButton;
    showSubmittedButton;
    submissionComment='';

    connectedCallback(){
        console.log( 'ID ::'+this.cerReq+' Status :: '+this.status+' Obj :: '+this.cerReqObject);
        if(this.status=='Draft') this.showSubmitButton=true;
        else if(this.status=='Assigned') this.showStatusUpdateButton=true;
        else this.showSubmittedButton=true;
    }

    handleComments(event){
        this.submissionComments = event.target.value;
        console.log(this.submissionComments);
//        console.log(typeOf(this.submissionComments));
    }
    handleSubmit(){
        singleRequest({recordId:this.cerReqObject.Id,comments:this.submissionComments})
        .then(data=>{
            console.log(data);
            const toastEvent = new ShowToastEvent({
                title:'Approval Request Submitted Successfully',
                message:data,
                variant:'success',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
            this.hideModalBox();
            this.dispatchEvent(new CustomEvent('refreshdata'));
        })
        .catch(error=>{
            console.log(error);
            const toastEvent = new ShowToastEvent({
                title:'Error in submitting approval request',
                message:error,
                variant:'error',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);

        })
    }

//Submission Comments Modal
    @track isShowModal = false;
    showModalBox() {  
        this.isShowModal = true;
    }
    hideModalBox() {  
        this.isShowModal = false;
    }

//Pass/Fail Update Modal
    @track isShowStatusUpdateModal = false;
    showStatusUpdateModal(){
        this.isShowStatusUpdateModal = true;
    }
    hideStatusUpdateModal(){
        this.isShowStatusUpdateModal = false;
    }
    radioGroupValue = '';
    get radioGroupOptions(){
        return [
            {label:'Pass',value:'Passed',variant:'Success'},
            {label:'Fail',value:'Failed',variant:'Destructive'}
        ]
    }
    handleRadioGroupValueChange(event){
        console.log(event.target.value);
        this.radioGroupValue = event.target.value;
        console.log(this.template.querySelectorAll('lightning-button')[1].label);
       if(this.radioGroupValue!='') this.template.querySelectorAll('lightning-button')[1].disabled = false;
    }
    handleStatusUpdate(){
        // console.log(this.cerReqId);
        passFailUpdate({status:this.radioGroupValue,cerReqRecordId:this.cerReqObject.Id})
        .then(data=>{
            console.log(data);
            const toastEvent = new ShowToastEvent({
                title:'Status Updated Successfully',
                message:data,
                variant:'success',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
            this.hideStatusUpdateModal();
        })
        .catch(error=>{
            console.log(error);
            const toastEvent = new ShowToastEvent({
                title:'Error in updating status',
                message:error.body.message,
                variant:'error',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);

        })
   }
}