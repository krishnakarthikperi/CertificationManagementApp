import { LightningElement, api ,wire } from 'lwc';
import { publish,subscribe,MessageContext,APPLICATION_SCOPE,unsubscribe } from 'lightning/messageService';
import REQUEST_RAISER_CHANNEL from '@salesforce/messageChannel/Request_Raiser__c';
import CERTIFICATION_OBJECT from '@salesforce/schema/Certification__c';
import { NavigationMixin } from 'lightning/navigation';

export default class RequestRaiserCertificationStage extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @wire(MessageContext)
    messageContext;
    cerName='';
    cerComments='';
    @api empData={};
    @api cerReqData={};

    priorCerData;
    @api cerData={};

    connectedCallback(){
        this.objectApiName = CERTIFICATION_OBJECT;
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel(){
        this.subscription = subscribe(
            this.messageContext,
            REQUEST_RAISER_CHANNEL,
            (message)=>this.handleMessage(message)
        );
    }

    handleMessage(message){
        this.empData = message.employeeData;
        this.cerData = message.certificatonData;
        this.cerReqData = message.certificatonRequestData;
        if(this.cerData!=null){
            this.cerName = message.certificatonData.name;
            this.cerComments = message.certificatonData.comments;
        }
        console.log(this.empData,this.cerData,this.cerReqData);
    }
    handleNextPage(e){
        this.CerData.name=this.cerName;
        this.CerData.comments=this.cerComments;
        const childEvent = new CustomEvent('cerdataevent',{
            detail:{
                "certificateData":this.cerData,
                "activePage":3
            }
        });
        this.dispatchEvent(childEvent);

        // const payload = {
        //     employeeData:this.empData,
        //     certificatonData:this.CerData,
        //     certificatonRequestData:this.cerReqData
        // };
        // publish(this.messageContext,REQUEST_RAISER_CHANNEL,payload);
    }
    handlePreviousPage(e){
        this.cerData.name=this.cerName;
        this.cerData.comments=this.cerComments;
        const payload = {
            employeeData:this.empData,
            certificatonData:this.cerData,
            certificatonRequestData:this.cerReqData
        };
        publish(this.messageContext,REQUEST_RAISER_CHANNEL,payload);
        this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
            attributes: {
                 apiName: 'Employees',
            }
        });   
        // this[NavigationMixin.GenerateUrl]({
        //     type: 'standard__navItemPage',
        //     attributes: {
        //         apiName: 'Employees',
        //     }
        // }).then(url => console.log(url));
        // console.log('pp end');
    }
    handleReset(){
        tempEmpData={};
        tempCerData={};
        tempCerReqData={};
        const payload = {
            employeeData:tempEmpData,
            certificatonData:tempCerData,
            certificatonRequestData:tempCerReqData
        };
        publish(this.messageContext,REQUEST_RAISER_CHANNEL,payload);
    }
}