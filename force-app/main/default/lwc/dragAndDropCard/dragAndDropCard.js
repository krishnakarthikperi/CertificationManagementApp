import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class DragAndDropCard extends NavigationMixin(LightningElement) {
    @api stage
    @api record

    get isSameStage(){
        return this.stage == this.record.Status__c;
    }
}