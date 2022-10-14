import { LightningElement,track } from 'lwc';
import getCertificatioRequestList from '@salesforce/apex/CertificationRequestLWCCtrl.getCertificatioRequestList';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CERTIFICATION_REQUEST_OBJECT from '@salesforce/schema/Certification_Request__c';


const cols=[
    {label:'Certification Request Number',fieldName:'Name'},
    {label:'Certification',fieldName:'CertificationName'},
    {label:'Employee Name',fieldName:'EmployeeName'},
    {label:'Employee Id',fieldName:'EmployeeId'},
    {label:'Approval Submission',fieldName:'Status__c',type:'submitForApprovalButton',typeAttributes:{recordID:{fieldName:'cerReqId'},recordObject:{fieldName:'cerReqObject'}}}
//    {label:'Approval Submission',fieldName:'Status__c',type:'submitForApprovalButton',typeAttribues:{recordId:{fieldName:'cerReqId'},recordObject:{fieldName:'cerReqObject'}}}   
];

const pageSize=10;
export default class CertificationRequestDetails extends NavigationMixin(LightningElement) {
    cerReqList;
    fullCerReqList;
    spinnerOn=false;
    columns=cols;
    searchKey='';

// Get Certification Request Records using Apex Class
getTheCertificatioRequestList(){
        this.spinnerOn=true;
        getCertificatioRequestList({key: this.searchKey})
        .then(data=>{
            let result = [];
            data.forEach(dataItem=>{
                let tempData = Object.create(dataItem);
// NavigationMixin for record URL 
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: dataItem.Id,
                        actionName: 'view',
                    },
                }).then((url) => {
                    tempData.CertificationRequestUrl = url;
                });

                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: dataItem.Certification__r.Id,
                        actionName: 'view',
                    },
                }).then((url) => {
                    tempData.CertificationUrl = url;
                });

                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: dataItem.Employee__c,
                        actionName: 'view',
                    },
                }).then((url) => {
                    tempData.EmployeeUrl = url;
                });
                tempData.CertificationName = dataItem.Certification__r.Name;
                tempData.EmployeeName = dataItem.Employee__r.Employee_Name__c;
                tempData.EmployeeId = dataItem.Employee__r.Name;
                tempData.cerReqObject = dataItem;
                tempData.cerReqId = dataItem.Id;
                result.push(tempData);
                console.log(tempData);
                console.log(tempData.Id);
            });
            this.fullCerReqList = result;
            console.table(this.fullCerReqList)
            this.cerReqList = this.fullCerReqList.slice(this.startSize,this.endSize);
            this.isPaginate = this.fullCerReqList.length >this.pageSize;
//Turn off spinner loading
            this.spinnerOn=false;
        })
        .catch(error=>{
            console.log(error);
            this.spinnerOn=false;
            const toastEvent = new ShowToastEvent({
                title:'Error in fetching Certification Request Records',
                message:error,
                variant:'error',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
        })
    }

// Call the getTheCertificatioRequestList() when the page is loaded for the first time.
    connectedCallback(){
        this.getTheCertificatioRequestList();
        //Success toast message
        const toastEvent = new ShowToastEvent({
            title:'Loaded Certification Request Details',
            variant:'Success',
            mode:'dismissible'
        });
        this.dispatchEvent(toastEvent);
    }

//Filter employee recods based on Name - fires when inputText is chaged
    filterCertificationRequestRecords(event){
        this.searchKey=event.target.value;
        this.getTheCertificatioRequestList();        
    }

//New Certification Request Record Form
    certificationRequestObject = CERTIFICATION_REQUEST_OBJECT;

//New Certification Request Modal
    @track isShowModal = false;
    showModalBox() {  
        this.isShowModal = true;
    }
    hideModalBox() {  
        this.isShowModal = false;
    }
    handleSuccess(event)
    {
//Show SUCCESS TOAST NOTIFICATION message
        this.dispatchEvent(                      
            new ShowToastEvent({
                title: 'Success',
                message: 'New Certification Request Added',
                variant: 'success'
            })
        );
        this.isShowModal = false;
        this.getTheCertificatioRequestList();
    }

//Pagination
    startSize = 0;
    endSize = pageSize;
    isPaginate = false;
    handlePrevious(){
        if(this.startSize>0){
        this.startSize = this.startSize - pageSize;
        this.endSize = this.endSize - pageSize;
        this.cerReqList = this.fullCerReqList.slice(this.startSize,this.endSize); 
        if(this.startSize==0) this.template.querySelectorAll('lightning-button')[1].disabled = true;
        this.template.querySelector('lightning-button')[2].disabled = this.endSize>=this.fullCerReqList.length;
        }
    }
    handleNext(){
        if(this.endSize<this.fullCerReqList.length){
        this.startSize = this.startSize + pageSize;
        this.endSize = this.endSize + pageSize;
        if(this.startSize!=0) this.template.querySelectorAll('lightning-button')[1].disabled = false;
        this.cerReqList = this.fullCerReqList.slice(this.startSize,this.endSize);
        } 
    }

}