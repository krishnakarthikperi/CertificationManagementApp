import LightningDatatable from 'lightning/datatable';
import clickableEmployeeIdTemplate from './clickableEmployeeIdTemplate.html';
import clickableVoucherIdTemplate from './clickableVoucherIdTemplate.html';
import submitForApprovalButtonTemplate from './submitForApprovalButtonTemplate.html';
import processApprovalButtonTemplate from './processApprovalButtonTemplate.html';
import employeeCardPopoverTemplate from './employeeCardPopoverTemplate.html';

export default class CustomDataTable extends LightningDatatable {
    static customTypes={
        clickableEmployeeId:{
            template:clickableEmployeeIdTemplate,
            standardCellLayout:true,
            typeAttributes:['recordId','recordObject']
        },
        clickableVoucherId:{
            template:clickableVoucherIdTemplate,
            standardCellLayout:true,
            typeAttributes:['recordId','recordObject']
        },
        submitForApprovalButton:{
            template:submitForApprovalButtonTemplate,
            standardCellLayout:true,
            typeAttributes:['recordId','recordObject']
        },
        processApprovalButton:{
            template:processApprovalButtonTemplate,
            standardCellLayout:true,
            typeAttributes:['recordId','recordObject','processInstanceWorkItemObject']
        },
        employeeCardPopover:{
            template:employeeCardPopoverTemplate,
            standardCellLayout:true,
            typeAttributes:['recordId','recordObject']
        }
    };
}