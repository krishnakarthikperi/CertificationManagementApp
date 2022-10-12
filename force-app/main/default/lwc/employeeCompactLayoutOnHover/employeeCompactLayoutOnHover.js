import { LightningElement,api } from 'lwc';

export default class EmployeeCompactLayoutOnHover extends LightningElement {
    @api recordId;
    @api empObj;
}