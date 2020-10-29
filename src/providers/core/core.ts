import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { DateProvider } from '../date/date';
import { ServiceProvider } from '../service/service';
import { SafeUrl } from '@angular/platform-browser';

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
export interface UserInterface{

  cpf: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  img: string | SafeUrl;
}
export interface RequestStatusInterface{

  cod: number;
  message: string;
}
export interface RequestContentInterface{

  data: any;
  id: number;
  lastVersion: string;
  status: RequestStatusInterface;
}
export interface RequestInterface{

  request: RequestContentInterface;
  
}
export interface postNews{

  imgAvatar: string;
  userName: string;
  date: string;
  img?: string;
  categories: string[];
  content: string;
}
export interface filterCategory{

  id: number,
  name: string,
  selected: boolean,
}
export interface scheduleItem{

  id: number;
  date: string;
  time: string;
  available: boolean;
  mySchedule: boolean;
  strAvailable: string;
  titleAdress: string;
  subTitleAdress: string;
  destination: string;
  imgDestination: string;
  reasonForCancellation?: reasonForCancellationInterface[];
  confirmPresence: boolean;
  presentConfirmPresence: boolean;

}
export interface reasonForCancellationInterface{

  description: string;
  id: number;
}

export interface UsuarioMedidaItem {

  measurementId: number;
  date: string;
  value: number;
  selected: boolean;
}

export interface UsuarioMedidaInterface {

  values?: UsuarioMedidaItem[];
  descriptionMeasure: string;
  idMeasure: number;
  active?: boolean;
  unityMeasure: string;
}

@Injectable()
export class CoreProvider {

  public dateSelectedPgAgenda = this.date.getToday();
  public dateSelectedPgAgendaObservable: Subject<any> = new Subject();

  private scheduleLoaded;
  public scheduleLoadedObservable: Subject<any> = new Subject();

  public userData: UserInterface = {cpf: '', email: '', id: 0, name: '', phone: '', img: ''};
  public userDataObservable: Subject<any> = new Subject();

  private foodPlan;
  public foodPlanObservable: Subject<any> = new Subject();

  private foodPlanSelected: FoodPlanInterface;
  public foodPlanSelectedObservable: Subject<FoodPlanInterface> = new Subject();

  private foodPlanContentSelected: FoodPlanItemInterface;
  public foodPlanContentSelectedObservable: Subject<FoodPlanItemInterface> = new Subject();

  public mySchedules: scheduleItem[];
  public mySchedulesObservable: Subject<scheduleItem[]> = new Subject();
  public optSelectedScheduleOpt: scheduleItem;

  public news: postNews[] = [{categories:[''],content:'',date:'',imgAvatar:'', userName:''}];
  public newObservable: Subject<postNews[]> = new Subject();
  public filterCategory: filterCategory[] = [{id: 0, name:'', selected: true}];

  
  
  constructor(public http: Http, private date: DateProvider, private service: ServiceProvider ) {

    this.initOberserFoodPlan()
  }

  initOberserFoodPlan(){

    let observer = {

      next: ( value ) => {


        if( value.request.method == 'updateFoodPlan' ){

          this.setFoodPlan( value.request.data );
        }
      },
      error: ( error ) => console.log( 'error oberserver foodPlan: ' + error ),
      complete: () => console.log('observer foodplan completo')
    }

    this.service.observableServerWS.subscribe( observer );
  }



  setMySchedule( value: scheduleItem[] ){

    this.mySchedules = value;
    this.mySchedulesObservable.next( value );
  }

  getMySchedule(){

    let newMySchedule = [].concat( this.mySchedules? this.mySchedules: [] );
    return newMySchedule;
  }

  setDateSelectedPgAgenda( value: string ){

    this.dateSelectedPgAgenda = value;
    this.dateSelectedPgAgendaObservable.next( value );
  }
  setScheduleLoaded( value ){

    this.scheduleLoaded = value;
    this.scheduleLoadedObservable.next( value ); 
  }

  setUserData( value: UserInterface ){

    this.userData = value;
    this.userDataObservable.next( value );
  }

  getUserData(){

    let newUserdata: UserInterface = {
      cpf: '' + this.userData.cpf,
      email: '' + this.userData.email,
      id: 0 + this.userData.id,
      name: '' + this.userData.name,
      phone: '' + this.userData.phone,
      img: ''
    };

    return newUserdata;
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

  getNews(){

    let news = [].concat(this.news);
    return news;
  }

  setNews( news: postNews[] ){

    this.news = news;
    //this.newObservable.next( news );
  }

  setFilterCategories( categories: filterCategory[] ){

    this.filterCategory = categories;
  }

  
}