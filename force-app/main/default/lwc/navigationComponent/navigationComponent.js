import { LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class NavigationComponent extends NavigationMixin(LightningElement) {
    
    navigateToCertifications(){
        console.log('nav to cer');            
        this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'Certifications',
                }
            });
    }
    navigateToEmployees(){
    this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Employees',
            }
        });
    }
    navigateToCertificationRequests(){
    this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Certification_Requests',
            }
        });
    }
    navigateToVouchers(){
    this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Vouchers',
            }
        });
    }
    navigateToApprovals(){
    this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Approvals',
            }
        });
    }
    navigateToHome(){
    this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            }
        });
    }
}