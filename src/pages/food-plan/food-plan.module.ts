import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodPlanPage } from './food-plan';

@NgModule({
  declarations: [
    FoodPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodPlanPage),
  ],
})
export class FoodPlanPageModule {}
