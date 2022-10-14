import { LightningElement,track,api } from 'lwc';

export default class ClickableVoucherId extends LightningElement {
//PopOver for Employee Details
    @api vouId;
    @api recordId;
    @track objRecordId;
    @api vouObject;

    topmargin;
    leftmargin;
    showDiv;
    handleMouseOver(event){
        this.showDiv=true;
        console.log('hovered');
        this.objRecordId = this.recordId;
        this.leftmargin=event.clientX;
        this.topmargin=event.clientY;
        const toolTipDiv = this.template.querySelector('.ModelTooltip');
        toolTipDiv.style.opacity = 1;
        toolTipDiv.style.display = "block";
        // eslint-disable-next-line
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.objRecordId = this.recordId;
        }, 50);
    
        console.log(this.empMap);
    }

    handleMouseOut(){
//        this.showDiv=false;
        const toolTipDiv = this.template.querySelector('.ModelTooltip');
        toolTipDiv.style.opacity = 0;
        toolTipDiv.style.display = "none";
    }

}