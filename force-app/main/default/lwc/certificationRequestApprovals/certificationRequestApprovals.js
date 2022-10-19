import { LightningElement,track } from 'lwc';
import getPendingApprovals from '@salesforce/apex/CertificationRequestApprovalsCtrl.getPendingApprovals';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const cols=[
    {label:'Certification Request',fieldName:'certificationRequestName'},
    {label:'Certification',fieldName:'certificationName'},
    {label:'Employee',fieldName:'employeeName'},
    {label:'Approve/Reject',fieldName:'piwId',type:'processApprovalButton'}
];

const pageSize =10;

export default class CertificationRequestApprovals extends LightningElement {
    cerReqApprList;
    fullCerReqApprList;
    spinnerOn = false;
    columns=cols;
    searchKey = '';

    getThePendingApprovals(){
        this.spinnerOn=true;
        getPendingApprovals({key: this.searchKey})
        .then(data=>{
            let result = [];
            console.log(data);
            data.forEach(dataItem=>{
                // console.log(dataItem);
                // console.log(dataItem.cerReq);
                // console.log(dataItem.cerReq.Name);
                // let tempData = Object.create(dataItem);
                // tempData.cerReqObject = dataItem.cerReq;
                // tempData.piwObject = dataItem.piw;
                // tempData.certificationRequestName = dataItem.cerReq.Name;
                // tempData.certificationName = dataItem.cerReq.Certification__r.Name;
                // tempData.employeeName = dataItem.cerReq.Employee__r.Employee_Name__c;
                let tempData = {}
                tempData.cerReqObject = dataItem[0];
                tempData.piwObject = dataItem[1];
                tempData.piwId = dataItem[1].Id;
                tempData.certificationRequestName = dataItem[0].Name;
                tempData.certificationName = dataItem[0].Certification__r.Name;
                tempData.employeeName = dataItem[0].Employee__r.Employee_Name__c;
                result.push(tempData);
            });
            this.fullCerReqApprList = result;
            this.cerReqApprList = this.fullCerReqApprList.slice(this.startSize,this.endSize);
            this.isPaginate = this.fullCerReqApprList.length >pageSize;
//Turn off spinner loading
            this.spinnerOn=false;
        })
        .catch(error=>{
            console.log(error);
            this.spinnerOn=false;
            const toastEvent = new ShowToastEvent({
                title:'Error in fetching Pending Approval Records',
                message:e.body.message,
                variant:'error',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
        })
    }

// Call the getThePendingApprovals() when the page is loaded for the first time.
    connectedCallback(){
        this.getThePendingApprovals();
        //Success toast message
        const toastEvent = new ShowToastEvent({
            title:'Loaded Pending Approval Details',
            variant:'Success',
            mode:'dismissible'
        });
        this.dispatchEvent(toastEvent);
    }

//Filter employee recods based on Name - fires when inputText is chaged
    filterPendingApprovalRecords(event){
        this.searchKey=event.target.value;
        this.getThePendingApprovals();        
    }
//Approval Modal
@track isShowModal = false;
    showModalBox() {  
        this.isShowModal = true;
    }
    hideModalBox() {  
        this.isShowModal = false;
    }

//Pagination
    startSize = 0;
    endSize = pageSize;
    isPaginate = false;
    handlePrevious(){
        if(this.startSize>0){
        this.startSize = this.startSize - pageSize;
        this.endSize = this.endSize - pageSize;
        this.cerReqApprList = this.fullCerReqApprList.slice(this.startSize,this.endSize); 
        if(this.startSize==0) this.template.querySelectorAll('lightning-button')[1].disabled = true;
        this.template.querySelector('lightning-button')[2].disabled = this.endSize>=this.fullCerReqApprList.length;
        }
    }
    handleNext(){
        if(this.endSize<this.fullCerReqApprList.length){
        this.startSize = this.startSize + pageSize;
        this.endSize = this.endSize + pageSize;
        if(this.startSize!=0) this.template.querySelectorAll('lightning-button')[1].disabled = false;
        this.cerReqApprList = this.fullCerReqApprList.slice(this.startSize,this.endSize);
        } 
    }

}