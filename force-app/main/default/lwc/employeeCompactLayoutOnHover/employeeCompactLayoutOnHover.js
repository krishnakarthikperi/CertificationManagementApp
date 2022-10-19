import { LightningElement,api,track } from 'lwc';

export default class EmployeeCompactLayoutOnHover extends LightningElement {
    @api recordId;
    @api empObj;
    @api topMargin; //-125 283
    @api leftMargin; //100 136
    @track style;
    rendered(event){
        this.topMargin = event.clientY;
        this.leftMargin = event.clientX;
        this.style='margin-top:'+(this.topMargin-408)+'px;'+'margin-left:'+(this.leftMargin-36)+'px;'
    }
    // style='margin-top:-125px;margin-left:100px;'
    handleMouseOver(){
    // style = 'topmargin:'+this.topMargin+';'+'leftmargin:'+this.leftMargin+';'
    console.log('margin-top:'+(this.topMargin-408)+'px;'+'margin-left:'+(this.leftMargin-36)+'px;');
    }
}