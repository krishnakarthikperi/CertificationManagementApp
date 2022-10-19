import { LightningElement } from 'lwc';
import getActiveVouchers from '@salesforce/apex/CMAChartDataLWCCtrl.getActiveVouchers';

export default class ActiveVouchersChart extends LightningElement {
    labels=[];
    details=[];
    colors=[];
    superLabel = `[`;
    superDetail = `[`;
    superColor=`[`;
    constructor(){
        super();
        getActiveVouchers().
        then(data=>{
            this.wiredResult = data;
            console.log('inside data');
            console.log(data);
            data.forEach(element => {
                let label = '';
                label =`"` +element.Name+ " ("+element.Cnt+`)"`;
                let detail = '';
                detail = element.Cnt;
                let color = '';
                color = `"`+ this.random_rgba()+`"`;
                this.labels.push(label);
                this.details.push(detail);
                this.colors.push(color);
                console.log(this.labels)
                console.log(this.details)
                console.log(this.colors)
            });
            this.superLabel =this.superLabel+ this.labels.toString() + `]`;
            this.superDetail = this.superDetail+ this.details.toString() + `]`;
            this.superColor = this.superColor+ this.colors.toString() + `]`;
            console.log(this.superLabel);
            console.log(this.superLabel);
            console.log(this.superColor);
        })
        .catch(error=>{
            console.log('inside error');
            console.log(error);
        })
    }


    random_rgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }

}