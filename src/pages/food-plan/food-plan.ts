import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CoreProvider, FoodPlanInterface, FoodPlanItemInterface, RequestInterface } from '../../providers/core/core';
import { FoodPlanContentPage } from '../food-plan-content/food-plan-content';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-food-plan',
  templateUrl: 'food-plan.html',
})
export class FoodPlanPage {

  private foodPlan: FoodPlanInterface[];
  private foodPlanteste: FoodPlanInterface[];
  private foodPlanSelected: FoodPlanItemInterface[];
  private relationship;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private core: CoreProvider,
    private serve: ServiceProvider,
    private loadingCtrl: LoadingController
  ) {

    let loading = this.loadingCtrl.create({

      content: 'Carregando'
    })
    loading.present();
    this.serve.send({

      method: 'updateFoodPlan',
      data: {}
    })
      .then((res: RequestInterface) => {

        loading.dismiss();
        this.foodPlan = res.request.data.length ? res.request.data : undefined;

        if (res.request.data[0]) {
          this.foodPlanSelected = res.request.data[0].foodPlan;
          this.core.setFoodPlanSelected(res.request.data[0]);
          this.relationship = res.request.data[0].title;
        }

      })
      .catch(res => {

        loading.dismiss();
        console.log(res);
      });

    this.core.foodPlanObservable.subscribe({

      next: res => {

        this.foodPlan = res;
        if (this.relationship) {

          this.foodPlanSelected = res.find(foodPlan => foodPlan.title == this.relationship).foodPlan;
        } else {

          console.log('sem foodplan selecionado');
        }
      }
    })
  }

  isConsumptioned(food) {

    return food.content.filter(food => food.consumption).length;
  }

  segmentChanged(event) {

    if (event) {

      this.core.setFoodPlanSelected(this.foodPlan.find(res => res.title == event.value));
      this.foodPlanSelected = this.foodPlan.find(res => res.title == event.value).foodPlan;
    } else {

      this.core.setFoodPlanSelected(this.foodPlan[0]);
      this.foodPlanSelected = this.foodPlan[0].foodPlan;
      this.relationship = this.foodPlan[0].title;
    }
  }

  openFoodPlanContent(food) {

    this.core.setFoodPlanContentSelected(food);
    this.navCtrl.push(FoodPlanContentPage);
  }

}
