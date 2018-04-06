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
  }

  ionViewDidLoad() {

    
  }

  addConsumption( meal, food ){

    let loading = this.loadingCtrl.create({

      content: 'Carregando'
    })
    loading.present();

    this.serve.send( {

      method: 'addConsumption',
      data: {

        planId: this.core.getFoodPlanSelected().planId,
        mealId: meal.mealId,
        foodId: food.foodId,
      }
    })
    .then( (res: any) => {

      loading.dismiss();
      if ( res.request.data.isConsumption ){

        console.log( 'deu certo' );
      }else{

        console.log( 'Não deu certo' );
      }

    })
    .catch( res => {
      
      loading.dismiss();
      console.log( res ) 
    });
  }

  ngAfterViewInit(){

    this.slides.autoHeight = true;
    this.slides.pager = true;
    this.slides.parallax = true;
    this.slides.paginationType = 'progress';
    this.slides.spaceBetween = -15;
}

}
