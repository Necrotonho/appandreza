import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController } from 'ionic-angular';
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

  constructor(  public navCtrl: NavController, 
                public navParams: NavParams, 
                public loadingCtrl: LoadingController,
                private core: CoreProvider, private serve: ServiceProvider ) {

    this.foodPlanContent = this.core.getFoodPlanContentSelected();
    this.core.foodPlanObservable.subscribe({

      next: ( res ) => {

        this.foodPlanContent = res.find( foodplan => foodplan.title == this.core.getFoodPlanSelected().title ).foodPlan
                                  .find( foodPlanContent => foodPlanContent.mealId == this.foodPlanContent.mealId );
      }
    })
  }

  ionViewDidLoad() {

    
  }

  switchConsumption( meal, food ){

    this.foodPlanContent.content.find( content => content.foodId == food.foodId ).loadingConsumption = true;

    this.serve.send( {

      method: food.consumption? 'cancelConsumption' : 'addConsumption',
      data: {

        planId: this.core.getFoodPlanSelected().planId,
        mealId: meal.mealId,
        foodId: food.foodId,
      }
    })
    .then( (res: any) => {})
    .catch( res => console.log( res ) );
  }


  ngAfterViewInit(){

    this.slides.autoHeight = true;
    this.slides.pager = true;
    this.slides.parallax = true;
    this.slides.paginationType = 'progress';
    this.slides.spaceBetween = -15;
}

}
