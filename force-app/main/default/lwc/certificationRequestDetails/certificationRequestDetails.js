import { LightningElement,track, wire } from 'lwc';
import getCertificatioRequestList from '@salesforce/apex/CertificationRequestLWCCtrl.getCertificatioRequestList';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CERTIFICATION_REQUEST_OBJECT from '@salesforce/schema/Certification_Request__c';
import IMAGES from '@salesforce/resourceUrl/CMAImages';

//========Import for Kanban Mode START======
import { getListUi } from 'lightning/uiListApi';
import { updateRecord } from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';
import { getPicklistValues,getObjectInfo } from 'lightning/uiObjectInfoApi';
import STATUS_FIELD from '@salesforce/schema/Certification_Request__c.Status__c';
import ID_FIELD from '@salesforce/schema/Certification_Request__c.Id';
//========Import for Kanban Mode END======

const cols=[
    {label:'Certification Request Number',fieldName:'CertificationRequestUrl',type:'url',typeAttributes:{label:{fieldName:'Name'}}},
    {label:'Certification',fieldName:'CertificationUrl',type:'url',typeAttributes:{label:{fieldName:'CertificationName'}}},
    {label:'Employee Name',fieldName:'EmployeeUrl',type:'url',typeAttributes:{label:{fieldName:'EmployeeName'}}},
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

    cerReqIcon = IMAGES + '/certificateRequest.png'
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
            this.isPaginate = this.fullCerReqList.length >pageSize;
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
        // console.log(this.template.querySelectorAll('lightning-button')[0].label)
        // console.log(this.template.querySelectorAll('lightning-button')[1].label)
        // console.log(this.template.querySelectorAll('lightning-button')[2].label)
        if(this.endSize<this.fullCerReqList.length){
        this.startSize = this.startSize + pageSize;
        this.endSize = this.endSize + pageSize;
        if(this.startSize!=0) this.template.querySelectorAll('lightning-button')[1].disabled = false;
        this.cerReqList = this.fullCerReqList.slice(this.startSize,this.endSize);
        } 
    }

    
// View Selector
    viewValue=false;
    get listViewRadioOptions(){
        return [
            { label: 'List View', value: 'false' },
            { label: 'Table View', value: 'true' },
            ]
    }
    handleViewChange(){
        this.viewValue=!this.viewValue;
    }

//Modular button button handler
    handleCertificationRequestViewDetails(event){
        console.log(event.target.value);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.value,
                objectApiName: 'Certification_Request__c',
                actionName: 'view'
            },
        });

    }
/*
//========Kanban Mode START======
    records;
    pickVals;
    recordId;
    @wire(getListUi,{
        objectApiName: CERTIFICATION_REQUEST_OBJECT,
        listViewApiName:'All'
    })wiredListView({error,data}){
        if(data){
            console.log("getListUi",data)
            this.records = data.records.records.map(item=>{
                let field = item.fields;
                let certificationRequest = field.Certification_Request__c.value.fields;
                return {'Id': field.Id.value,'Name':field.Name.Value,'Status':field.Status__c.value}
            })
        }
        if(error){
            console.error(error);
        }
    }

    @wire(getObjectInfo,{objectApiName:CERTIFICATION_REQUEST_OBJECT})
    objectInfo;

    @wire(getPicklistValues,{
        recordTypeId:'$objectInfo.data.defaultRecordTypeId',
        fieldApiName:STATUS_FIELD
    })stagePicklistValues({data,error}){
        if(data){
            console.log("Stage Picklist",data)
            this.pickVals = data.values.map(item=>item.value)
        }
        if(error){
            console.error(error)
        }
    }

    get calcWidth(){
        let len = this.pickVals.length+1
        return `width: calc(100vw/${len})`
    }
//========Kanban Mode END======
*/    
}