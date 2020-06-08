import { Injectable } from '@angular/core';
import { FoodPlanItemInterface, FoodPlanInterface, FoodPlanItemContentInterface } from '../core/core';

/*
  Generated class for the FoodPlanProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FoodPlanProvider {

  public foodPlanSelected: FoodPlanItemInterface;
  public foodPlan: FoodPlanInterface[];
  public nextFoodSelected: FoodPlanItemContentInterface[];

  constructor() {
    
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

    this.foodPlanSelected = {
      mealId:'',
      hour:'',
      description: '',
      content: []
    }

    this.nextFoodSelected = [{
      foodId: '0',
      imgFood:'',
      ingredients: [''],
      modePrepare: '',
      obs: ''
    }]

  }

}
