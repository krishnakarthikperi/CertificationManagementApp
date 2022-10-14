import { LightningElement,api } from 'lwc';

export default class VoucherPopoverLayout extends LightningElement {
    @api recordId;
    @api vouObj;
}