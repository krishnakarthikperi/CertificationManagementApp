import { LightningElement, track } from 'lwc';
import getEmployeeList from '@salesforce/apex/EmployeeLWCCtrl.getEmployeeList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import EMPLOYEE_OBJECT from '@salesforce/schema/Employee__c';


const cols =[
    {label:'Employee ID',fieldName:'Name',type:'text',initialWidth:80,cellAttributes: { alignment: 'left' }},
    // {label:'Name',fieldName:'Employee_Name__c',type:'text',initialWidth:200,cellAttributes: { alignment: 'left' }},
    {label:'Name',fieldName:'EmployeeUrl',type:'url',initialWidth:200,cellAttributes: { alignment: 'left' }, typeAttributes :{label:{fieldName:'Employee_Name__c'}}},
    {label:'Email',fieldName:'Email__c',type:'email',initialWidth:300,cellAttributes: { alignment: 'left' }},
    {label:'Experience',fieldName:'Experience__c',type:'number',fixedWidth:100,cellAttributes: { alignment: 'left' }}
];
export default class EmployeeDetails extends LightningElement {
    empList;
    spinnerOn = false;
    columns=cols;
    searchKey = '';
    
// Call the getTheEmployeeList() when the page is loaded for the first time.
    connectedCallback(){
        this.getTheEmployeeList();
                     const toastEvent = new ShowToastEvent({
                        title:'Loaded Employee Details',
                        variant:'Success',
                        mode:'dismissible'
                    });
                    this.dispatchEvent(toastEvent);
    }

    getTheEmployeeList(){
        this.spinnerOn=true;
        getEmployeeList({empName: this.searchKey})
        .then(data=>{
            let result = [];
            data.forEach(dataItem=>{
                let tempData = Object.create(dataItem);
                tempData.EmployeeUrl = '/'+dataItem.Id;
                result.push(tempData);
            });
            this.empList = result;
//Turn off spinner loading
            this.spinnerOn=false;

//Success toast message
/*             const toastEvent = new ShowToastEvent({
                title:'Success',
                message:'Employee records successfully fetched',
                variant:'Success',
                mode:'dismissible'
            });
            this.dispatchEvent(toastEvent);
 */        })
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

//PopOver for Employee Details
    @track objRecordId;
    handleMouseOver(event){
        const toolTipDiv = this.template.querySelector('div.ModelTooltip');
        toolTipDiv.style.opacity = 1;
        toolTipDiv.style.display = "block";
        // eslint-disable-next-line
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.objRecordId = "a005g000035ZLbxAAG";
        }, 50);
    }

    handleMouseOut(){
        const toolTipDiv = this.template.querySelector('div.ModelTooltip');
        toolTipDiv.style.opacity = 0;
        toolTipDiv.style.display = "none";
    }
}