import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FoodPlanPage } from '../food-plan/food-plan';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {

  }

  openPage( page ){

    this.navCtrl.push( FoodPlanPage );
  }
}
