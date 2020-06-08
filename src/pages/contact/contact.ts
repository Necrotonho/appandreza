import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FoodPlanPage } from '../food-plan/food-plan';
import { MyMeasurementsPage } from '../my-measurements/my-measurements';
import { CoreProvider } from '../../providers/core/core';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, private core: CoreProvider) {

  }

  openFoodPlanPage( ){

    this.navCtrl.push( FoodPlanPage );
  }
  
  openMyMeasurementsPage( ){

    this.navCtrl.push( MyMeasurementsPage );
  }
}
