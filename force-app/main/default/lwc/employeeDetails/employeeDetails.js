import { LightningElement, track } from 'lwc';
import getEmployeeList from '@salesforce/apex/EmployeeLWCCtrl.getEmployeeList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import EMPLOYEE_OBJECT from '@salesforce/schema/Employee__c';
import getEmployeeRelatedList from '@salesforce/apex/EmployeeLWCCtrl.getEmployeeRelatedList'
import { NavigationMixin } from 'lightning/navigation';

const cols =[
    // {label:'Employee ID',fieldName:'Name',type:'text',initialWidth:80,cellAttributes: { alignment: 'left' }},
    // {label:'Name',fieldName:'Employee_Name__c',type:'text',initialWidth:200,cellAttributes: { alignment: 'left' }},
    {label:'Employee ID',fieldName:'Name',type:'clickableEmployeeId',cellAttributes: { alignment: 'left'},typeAttributes:{recordId:{fieldName:'Id'},recordObject:{fieldName:'empObject'}}},
    {label:'Name',fieldName:'EmployeeUrl',type:'url',cellAttributes: { alignment: 'left' }, typeAttributes :{label:{fieldName:'Employee_Name__c'}}},
    {label:'Email',fieldName:'Email__c',type:'email',cellAttributes: { alignment: 'left' }},
    {label:'Experience',fieldName:'Experience__c',type:'number',fixedWidth:100,cellAttributes: { alignment: 'left' }}
];
const pageSize = 10;
export default class EmployeeDetails extends NavigationMixin(LightningElement) {
    empList;
    fullEmpList;
    spinnerOn = false;
    columns=cols;
    searchKey = '';
    //empMap;
    
// Call the getTheEmployeeList() when the page is loaded for the first time.
    connectedCallback(){
        this.getTheEmployeeList();
        //Success toast message
        const toastEvent = new ShowToastEvent({
            title:'Loaded Employee Details',
            variant:'Success',
            mode:'dismissible'
        });
        this.dispatchEvent(toastEvent);

// Employee Details Map
        getEmployeeRelatedList()
        .then(data=>{
            console.log(data);
//            empMap=data;
        })
        .catch(error=>{
            console.log(error);
        })
    }
    
    getTheEmployeeList(){
        this.spinnerOn=true;
        getEmployeeList({empName: this.searchKey})
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
                    tempData.EmployeeUrl = url;
                });
                // tempData.EmployeeUrl = '/'+dataItem.Id;
                tempData.empObject = dataItem;
                result.push(tempData);
            });
            this.fullEmpList = result;
            this.empList = this.fullEmpList.slice(this.startSize,this.endSize);
            this.isPaginate = this.fullEmpList.length >this.pageSize;
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

//Filter employee recods based on Name - fires when inputText is chaged
    filterEmployeeRecords(event){
        this.searchKey=event.target.value;
        this.getTheEmployeeList();        
    }

//New Employee Record Form
    employeeObject = EMPLOYEE_OBJECT;

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
        this.isShowModal = false;
        this.getTheEmployeeList();
       // eval("$A.get('e.force:refreshView').fire();");
    }


//Pagination
    startSize = 0;
    endSize = pageSize;
    isPaginate = false;
    handlePrevious(){
        if(this.startSize>0){
        this.startSize = this.startSize - pageSize;
        this.endSize = this.endSize - pageSize;
        this.empList = this.fullEmpList.slice(this.startSize,this.endSize); 
        if(this.startSize==0) this.template.querySelectorAll('lightning-button')[1].disabled = true;
        this.template.querySelector('lightning-button')[2].disabled = this.endSize>=this.fullEmpList.length;
        }
    }
    handleNext(){
        if(this.endSize<this.fullEmpList.length){
        this.startSize = this.startSize + pageSize;
        this.endSize = this.endSize + pageSize;
        if(this.startSize!=0) this.template.querySelectorAll('lightning-button')[1].disabled = false;
        this.empList = this.fullEmpList.slice(this.startSize,this.endSize);
        } 
    }
}