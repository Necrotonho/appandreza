import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CoreProvider, FoodPlanItemContentInterface, FoodPlanInterface, FoodPlanItemInterface } from '../../providers/core/core';
import { FoodPlanContentPage } from '../food-plan-content/food-plan-content';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-food-plan',
  templateUrl: 'food-plan.html',
})
export class FoodPlanPage {

  private foodPlan: Array<FoodPlanInterface>;
  private foodPlanSelected: Array<FoodPlanItemInterface>;
  private relationship;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private core: CoreProvider, 
              private serve: ServiceProvider,
              private loadingCtrl: LoadingController
            )
    {

      this.initOberserServer();
      this.foodPlan = [{
        planId: '',
        title: '',
        foodPlan: [{
          mealId: '',
          hour: '',
          description: '', 
          content: [{
            foodId: '',
            imgFood: '',
            ingredients: [''],
            modePrepare: '',
            obs: ''
          }]
        }]
      }];
      let loading = this.loadingCtrl.create({

        content: 'Carregando'
      })
      loading.present();
      this.serve.send({

        method: 'updateFoodPlan',
        data:{}
      })
      .then( ( res: any ) => {
      
        loading.dismiss();
        this.foodPlan = res.request.data;
        this.foodPlanSelected = res.request.data[0].foodPlan;
        this.core.setFoodPlanSelected( res.request.data[0] );
        this.relationship = res.request.data[0].title;
      })
      .catch( res => {
        
        loading.dismiss();  
        console.log( res ) ;
      });

  }

  ionViewDidLoad() {

    
  }

  initOberserServer(){

    let observer = {

      next: ( value ) => {


        if( value.request.method == 'updateFoodPlan' ){

          this.core.setFoodPlan( value.request.data );
        }
      },
      error: ( error ) => console.log( 'error oberserver foodPlan: ' + error ),
      complete: () => console.log('observer foodplan completo')
    }

    this.serve.observableServerWS.subscribe( observer );
  }

  segmentChanged( event ){

    if( event ){

      this.core.setFoodPlanSelected( this.foodPlan.find( res => res.title == event.value ) );
      this.foodPlanSelected = this.foodPlan.find( res => res.title == event.value ).foodPlan;
    }else{
      
      this.core.setFoodPlanSelected( this.foodPlan[0] );
      this.foodPlanSelected = this.foodPlan[0].foodPlan;
      this.relationship = this.foodPlan[0].title;
    }
  }

  openFoodPlanContent( food ){

    this.core.setFoodPlanContentSelected( food );
    this.navCtrl.push( FoodPlanContentPage );
  }

}
