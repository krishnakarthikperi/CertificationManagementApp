import { LightningElement,track } from 'lwc';
import getCertificationList from '@salesforce/apex/CertificationLWCCtrl.getCertificationList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CERTIFICATION_OBJECT from '@salesforce/schema/Certification__c';
import { NavigationMixin } from 'lightning/navigation';
import IMAGES from '@salesforce/resourceUrl/CMAImages';

const cols = [
    {label:'Certification ID',fieldName:'Certification_ID__c',type:'text'},
    {label:'Certification Name',fieldName:'CertificationUrl',type:'url', typeAttributes :{label:{fieldName:'Name'}}},
    {label:'Comments',fieldName:'Comments__c',type:'text'}

]
const pageSize = 10;

export default class CertificationDetails extends NavigationMixin(LightningElement) {
    columns=cols;
    searchKey='';
    spinnerOn = false;
    @track certList;
    @track fullCertList;

    cerIcon = IMAGES + '/certificate1.png';

//Get Certification Records using Apex Class
    getTheCertificationList(){
        this.spinnerOn=true;
        getCertificationList({certName: this.searchKey})
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
                    tempData.CertificationUrl = url;
                });
                // tempData.CertificationUrl = '/'+dataItem.Id;
                result.push(tempData);
            });
            this.fullCertList = result;
            this.certList = this.fullCertList.slice(this.startSize,this.endSize);
            this.isPaginate = this.fullCertList.length >this.pageSize;
//Turn off spinner loading
            this.spinnerOn=false;
        })
        .catch(error=>{
            console.log(error);
            this.spinnerOn=false;
            const toastEvent = new ShowToastEvent({
                title:'Error in fetching Employee Records',
                message:error,
                variant:'error',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
        })
    }

// Call the getTheCertificationList() when the page is loaded for the first time.
    connectedCallback(){
        this.getTheCertificationList();
        //Success toast message
        const toastEvent = new ShowToastEvent({
            title:'Loaded Certification Details',
            variant:'Success',
            mode:'dismissible'
        });
        this.dispatchEvent(toastEvent);
    }

//Filter certification recods based on Name - fires when inputText is chaged
    filterCertificationRecords(event){
        this.searchKey=event.target.value;
        this.getTheCertificationList();        
    }

//New Employee Record Form
    certificationObject = CERTIFICATION_OBJECT;

//New Employee Modal
    @track isShowModal = false;
    showModalBox() {  
        this.isShowModal = true;
    }
    hideModalBox() {  
        this.isShowModal = false;
    }
    handleSuccess(event)
    {
        this.dispatchEvent(                      //show success message
            new ShowToastEvent({
                title: 'Success',
                message: 'New Certification Added',
                variant: 'success'
            })
        );
       // eval("$A.get('e.force:refreshView').fire();");
       this.isShowModal = false;
       this.getTheCertificationList();
    }


//Pagination
    startSize = 0;
    endSize = pageSize;
    isPaginate = false;
    handlePrevious(){
        if(this.startSize>0){
        this.startSize = this.startSize - pageSize;
        this.endSize = this.endSize - pageSize;
        this.vouList = this.fullVouList.slice(this.startSize,this.endSize); 
        if(this.startSize==0) this.template.querySelectorAll('lightning-button')[1].disabled = true;
        this.template.querySelector('lightning-button')[2].disabled = this.endSize>=this.fullVouList.length;
        }
    }
    handleNext(){
        if(this.endSize<this.fullVouList.length){
        this.startSize = this.startSize + pageSize;
        this.endSize = this.endSize + pageSize;
        if(this.startSize!=0) this.template.querySelectorAll('lightning-button')[1].disabled = false;
        this.vouList = this.fullVouList.slice(this.startSize,this.endSize);
        } 
    }

// View Selector
    viewValue=true;
    get listViewRadioOptions(){
        return [
            { label: 'List View', value: 'true' },
            { label: 'Table View', value: 'false' },
            ]
    }
    handleViewChange(){
        this.viewValue=!this.viewValue;
    }

}