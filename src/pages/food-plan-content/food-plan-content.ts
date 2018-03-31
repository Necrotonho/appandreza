import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the FoodPlanContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-food-plan-content',
  templateUrl: 'food-plan-content.html',
})
export class FoodPlanContentPage {

  @ViewChild(Slides) slides: Slides;

  private sliderOptions = { pager: true, autoHeight: true };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodPlanContentPage');
  }

  ngAfterViewInit(){
    this.slides.autoHeight = true;
}

}
