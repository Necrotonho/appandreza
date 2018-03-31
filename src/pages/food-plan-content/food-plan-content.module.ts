import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodPlanContentPage } from './food-plan-content';

@NgModule({
  declarations: [
    FoodPlanContentPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodPlanContentPage),
  ],
})
export class FoodPlanContentPageModule {}
