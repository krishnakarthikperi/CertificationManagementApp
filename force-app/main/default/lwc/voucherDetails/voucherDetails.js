import { LightningElement,track } from 'lwc';
import getVoucherList from '@salesforce/apex/VoucherLWCCtrl.getVoucherList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import VOUCHER_OBJECT from '@salesforce/schema/Voucher__c';

const cols=[
    {label:'Voucher ID',fieldName:'voucherUrl',type:'url',typeAttributes :{label:{fieldName:'Name'}}},
    {label:'Certification',fieldName:'certificationUrl',type:'url',typeAttributes :{label:{fieldName:'certificationName'}}},
    // {label:'Voucher Cost',fieldName:'Voucher_Cost__c'},
    // {label:'Validity',fieldName:'Validity__c'},
    // {label:'Comments',fieldName:'Comments__c'},
    {label:'Active',fieldName:'Active__c'}
];
const pageSize = 10;
export default class VoucherDetails extends NavigationMixin(LightningElement) {
    vouList;
    fullVouList;
    spinnerOn = false;
    columns=cols;
    searchKey='';

// Get the Vouchers List using APEX Class
    getTheVoucherList(){
        this.spinnerOn=true;
        getVoucherList({cerName: this.searchKey})
        .then(data=>{
            let result = [];
            data.forEach(dataItem=>{
                let tempData = Object.create(dataItem);
                tempData.certificationName = dataItem.Certification__r.Name;
// NavigationMixin for Voucher Record URL 
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: dataItem.Id,
                        actionName: 'view',
                    },
                }).then((url) => {
                    tempData.voucherUrl = url;
                });
// NavigationMixin for Certification Record URL 
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: dataItem.Certification__c,
                        actionName: 'view',
                    },
                }).then((url) => {
                    tempData.certificationUrl = url;
                });
                tempData.empObject = dataItem;
                result.push(tempData);
            });
            this.fullVouList = result;
            this.vouList = this.fullVouList.slice(this.startSize,this.endSize);
            this.isPaginate = this.fullVouList.length >pageSize;
//Turn off spinner loading
            this.spinnerOn=false;
        })
        .catch(error=>{
            console.log(error);
            this.spinnerOn=false;
            const toastEvent = new ShowToastEvent({
                title:'Error in fetching Vouchers',
                message:error,
                variant:'error',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
        })
    }

// Call the getTheVoucherList() when the page is loaded for the first time.
    connectedCallback(){
        this.getTheVoucherList();
        //Success toast message
        const toastEvent = new ShowToastEvent({
            title:'Loaded Voucher Details',
            variant:'Success',
            mode:'dismissible'
        });
        this.dispatchEvent(toastEvent);
    }

//Filter voucher recods based on Certification Name - fires when inputText is chaged
    filterVoucherRecords(event){
        this.searchKey=event.target.value;
        this.getTheVoucherList();        
    }

//New Employee Record Form
    voucherObject = VOUCHER_OBJECT;

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
//Show SUCCESS TOAST NOTIFICATION message
        this.dispatchEvent(                      
            new ShowToastEvent({
                title: 'Success',
                message: 'New Employee Added',
                variant: 'success'
            })
        );
        this.getTheVoucherList();
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
}