import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { CoreProvider, FoodPlanItemInterface } from '../../providers/core/core';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-food-plan-content',
  templateUrl: 'food-plan-content.html',
})
export class FoodPlanContentPage {

  @ViewChild(Slides) slides: Slides;

  private foodPlanContent: FoodPlanItemInterface;

  constructor( public navCtrl: NavController, public navParams: NavParams, private core: CoreProvider, private serve: ServiceProvider ) {

    this.foodPlanContent = this.core.getFoodPlanContentSelected();
  }

  ionViewDidLoad() {

    
  }

  ngAfterViewInit(){

    this.slides.autoHeight = true;
    this.slides.pager = true;
    this.slides.parallax = true;
    this.slides.paginationType = 'progress';
    this.slides.spaceBetween = -15;
}

}
