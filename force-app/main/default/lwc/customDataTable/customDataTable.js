import LightningDatatable from 'lightning/datatable';
import clickableEmployeeIdTemplate from './clickableEmployeeIdTemplate.html';

export default class CustomDataTable extends LightningDatatable {
    static customTypes={
        clickableEmployeeId:{
            template:clickableEmployeeIdTemplate,
            standardCellLayout:true,
            typeAttributes:['recordId','recordObject']
        }
    };
}