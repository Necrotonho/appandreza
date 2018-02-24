import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { DateProvider } from '../date/date';

/*
  Generated class for the CoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CoreProvider {

  private dateSelectedPgAgenda = this.date.getToday();
  public dateSelectedPgAgendaObservable: Subject<any> = new Subject();

  private scheduleLoaded;
  public scheduleLoadedObservable: Subject<any> = new Subject();

  constructor(public http: Http, private date: DateProvider) {
    console.log('Hello CoreProvider Provider');
  }

  setDateSelectedPgAgenda( value: string ){

    this.dateSelectedPgAgenda = value;
    this.dateSelectedPgAgendaObservable.next( value );
  }
  setScheduleLoaded( value ){

    this.scheduleLoaded = value;
    this.scheduleLoadedObservable.next( value ); 
  }

}
