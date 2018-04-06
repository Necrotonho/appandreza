import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { DateProvider } from '../date/date';
import { ServiceProvider } from '../service/service';
import { HtmlParser, HtmlTagDefinition } from '@angular/compiler';

export interface FoodPlanItemContentInterface{

  foodId: string;
  imgFood: string;
  ingredients: Array<string>;
  modePrepare: string;
  obs: string;
  loadingConsumption?: boolean;

}
export interface FoodPlanItemInterface{

  mealId: string;
  hour: string;
  description: string;
  content: Array<FoodPlanItemContentInterface>;

}
export interface FoodPlanInterface{

  title: string;
  foodPlan: Array<FoodPlanItemInterface>;
  planId: string;
}

@Injectable()
export class CoreProvider {

  public dateSelectedPgAgenda = this.date.getToday();
  public dateSelectedPgAgendaObservable: Subject<any> = new Subject();

  private scheduleLoaded;
  public scheduleLoadedObservable: Subject<any> = new Subject();

  private userData;
  public userDataObservable: Subject<any> = new Subject();

  private foodPlan;
  public foodPlanObservable: Subject<any> = new Subject();

  private foodPlanSelected: FoodPlanInterface;
  public foodPlanSelectedObservable: Subject<any> = new Subject();

  private foodPlanContentSelected: FoodPlanItemInterface;
  public foodPlanContentSelectedObservable: Subject<any> = new Subject();

  constructor(public http: Http, private date: DateProvider, private server: ServiceProvider ) {

    console.log('classe core criada');
  }

  setDateSelectedPgAgenda( value: string ){

    this.dateSelectedPgAgenda = value;
    this.dateSelectedPgAgendaObservable.next( value );
  }
  setScheduleLoaded( value ){

    this.scheduleLoaded = value;
    this.scheduleLoadedObservable.next( value ); 
  }

  setUserData( value ){

    this.userData = value;
    this.userDataObservable.next( value );
  }

  getUserData(){

    return this.userData;
  }

  setFoodPlan( value: Array<FoodPlanInterface> ){

    this.foodPlan = value;
    this.foodPlanObservable.next( value );
  }

  getFoodPlan(){

    let foodplan = [].concat(this.foodPlan);
    return foodplan;
  }

  setFoodPlanContentSelected( foodPlanContent: FoodPlanItemInterface ){

    this.foodPlanContentSelected = foodPlanContent;
    this.foodPlanContentSelectedObservable.next( foodPlanContent );
  }

  getFoodPlanContentSelected(){

    return this.foodPlanContentSelected;
  }

  setFoodPlanSelected( foodPlan: FoodPlanInterface ){

    this.foodPlanSelected = foodPlan;
    this.foodPlanSelectedObservable.next( foodPlan );
  }

  getFoodPlanSelected(){

    return this.foodPlanSelected;
  }
}
