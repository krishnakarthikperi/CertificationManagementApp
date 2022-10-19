import { LightningElement, wire } from 'lwc';
import getPassFail from '@salesforce/apex/CMAChartDataLWCCtrl.getPassFail';

export default class PassFailChart extends LightningElement {
    wiredResult;
    labels=[];
    details=[];
    colors=[];
    superLabel = `[`;
    superDetail = `[`
    constructor(){
        super();
        getPassFail().
        then(data=>{
            this.wiredResult = data;
            console.log('inside data');
            console.log(data);
            data.forEach(element => {
                let label = '';
                label =`"` +element.Name + ' - '+element.Status__c+`"`;
                let detail = '';
                detail = element.Cnt;
                this.labels.push(label);
                this.details.push(detail);
                if(element.Status__c=='Passed') this.colors.push("rgba(81, 249, 146,0.4)");
                else this.colors.push("rgba(248, 107, 146,0.4)");
                console.log(this.labels)
                console.log(this.details)
                console.log(this.colors)
            });
            this.superLabel =this.superLabel+ this.labels.toString() + `]`;
            this.superDetail = this.superDetail+ this.details.toString() + `]`;
            console.log(this.superLabel);
            console.log(this.superDetail);
        })
        .catch(error=>{
            console.log('inside error');
            console.log(error);
        })
    }
}