import { LightningElement,track,api } from 'lwc';
import processSingleApproval from '@salesforce/apex/CertificationRequestApprovalsCtrl.processSingleApproval';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProcessApprovalButton extends LightningElement {
    // @api cerReqId;
    // @api cerReqObject;
    @api pwiId;         //ProcessWorkItem
    approverComment='';
    showSubmitButton;
    
    handleComments(event){
        this.approverComment = event.target.value;
        if(this.approverComment!=''){
            this.template.querySelectorAll('lightning-button')[1].disabled=false;            
            this.template.querySelectorAll('lightning-button')[2].disabled=false;
        }
        else{
            this.template.querySelectorAll('lightning-button')[1].disabled=true;
            this.template.querySelectorAll('lightning-button')[2].disabled=true;            
        }
    }

    handleSubmit(event){
        console.log(this.pwiId);
        console.log(event.target.value);
        console.log(this.approverComment);
        processSingleApproval({workItemId:this.pwiId,action:event.target.value,approverComments:this.approverComment})
        .then(data=>{
            console.log(data);
            const toastEvent = new ShowToastEvent({
                title:'Action Successful',
                message:data,
                variant:'success',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
        })
        .catch(error=>{
            console.log(error);
            const toastEvent = new ShowToastEvent({
                title:'Error in processing',
                message:error.body.message,
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

}