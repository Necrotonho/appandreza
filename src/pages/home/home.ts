import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { NavController } from 'ionic-angular';

import { ServiceProvider } from '../../providers/service/service';
import { CoreProvider, postNews, RequestInterface, FoodPlanItemInterface, FoodPlanInterface, FoodPlanItemContentInterface } from '../../providers/core/core';
import { UserProvider } from '../../providers/user/user';
import { MySchedulesPage } from '../my-schedules/my-schedules';
import { DateProvider } from '../../providers/date/date';
import { FoodPlanContentPage } from '../food-plan-content/food-plan-content';
import { FoodPlanProvider } from '../../providers/food-plan/food-plan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ display: 'block', height: 'auto' })),
      state('hidden', style({ display: 'none', height: 0 })),
      transition('* => *', animate('150ms'))
    ])
  ]
})
export class HomePage {

  private news: postNews[];
  private relationship;
  

  constructor(public navCtrl: NavController,
              private user: UserProvider,
              public service: ServiceProvider, 
              private date: DateProvider,
              public foodPlanService: FoodPlanProvider,
              private core: CoreProvider
              ) {

                console.log('useragent', navigator.userAgent)

    this.initOberserServer();
    this.user.initSession()
  }


  segmentChanged( event ){

    if( event ){

      this.core.setFoodPlanSelected( this.foodPlanService.foodPlan.find( res => res.title == event.value ) );
      let nextFood = this.foodPlanService.foodPlan.find( res => res.title == event.value ).foodPlan.find( item => this.date.compareHourNow( item.hour ) < 0  );
      this.foodPlanService.foodPlanSelected = nextFood;
      this.foodPlanService.nextFoodSelected = nextFood.content;
    }else{
      
      this.core.setFoodPlanSelected( this.foodPlanService.foodPlan[0] );
      this.foodPlanService.foodPlanSelected = this.foodPlanService.foodPlan[0].foodPlan.find( item => this.date.compareHourNow( item.hour ) < 0  );
      // this.relationship = this.foodPlanService.foodPlan[0].title;
    }
  }

  openFoodPlanContent(  ){

    this.core.setFoodPlanContentSelected( this.foodPlanService.foodPlanSelected );
    this.navCtrl.push( FoodPlanContentPage );
  }

  openPageMySchedule(){

    this.navCtrl.push( MySchedulesPage );
  }
  
  initOberserServer(){

    let observer = {

      next: ( value ) => {

        if( value.request.method == 'updateNews' ){

          if( value.request.data.length  ){

            this.core.setNews( value.request.data );
          }
        }
      },
      error: ( error ) => console.log( 'error oberserver updateNews: ' + error ),
      complete: () => console.log('observer updateNews completo')
    }

    this.service.observableServerWS.subscribe( observer );
  }

  filterCategory( post ){

    return post.categories.filter( category => {

      let find = this.core.filterCategory.find( cat => cat.name == category );
      return find ? find.selected: false;
    }).length

  }
}
