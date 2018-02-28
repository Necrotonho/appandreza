import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { DateProvider } from '../date/date';
import { ServiceProvider } from '../service/service';

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

  constructor(public http: Http, private date: DateProvider, private server: ServiceProvider ) {

    this.updateCore();
    console.log('classe core criada');
  }

  updateCore(){

    let observer = {

      next: ( value ) => {
        
        if( value.request.method == 'updateScheduleByDay' ){
          
          this.setScheduleLoaded( value.request.data );
          console.log( 'resquest server: ' + value.request.method );
        }
      },
      error: ( value ) => console.log('Erro no error do observer[Request] da class core'),
      complete: () => console.log( 'atualização core completo' )
    };

    this.server.observableServerWS.subscribe( observer );
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
