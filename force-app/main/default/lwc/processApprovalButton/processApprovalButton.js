import { LightningElement,track,api } from 'lwc';
import processSingleApproval from '@salesforce/apex/CertificationRequestApprovalsCtrl.processSingleApproval';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProfileName from '@salesforce/apex/GetCurrentProfileDetails.getProfileName';

export default class ProcessApprovalButton extends LightningElement {
    // @api cerReqId;
    // @api cerReqObject;
    @api pwiId;         //ProcessWorkItem
    approverComment='';
    showSubmitButton;
    profileName='';

/*     constructor(){
        super();
        getProfileName()
        .then(data=>{
            this.profileName = data;
            console.log(data);
        })
        .catch(error=>{
            console.log(error);
        });
    }
    */
    renderedCallback(){
        getProfileName()
        .then(data=>{
            this.profileName = data;
            console.log(data);
            if(this.profileName!='CMA App User'){
                console.log(this.profileName)
                console.log('inside if');
                console.log(this.template.querySelectorAll('lightning-button')[0].label);
                this.template.querySelectorAll('lightning-button')[0].disabled=false;
            }
        })
        .catch(error=>{
            console.log(error);
        });
    }
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
            this.hideModalBox();
            this.dispatchEvent(new CustomEvent('refreshapprovalsdata'));
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