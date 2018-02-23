import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { CoreProvider } from '../../providers/core/core';
import { DateProvider } from '../../providers/date/date';


@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html'
})
export class AgendaPage {

  private shownGroup = null;
  private loading;
  private schedule: [object];

  constructor(
    public navCtrl: NavController, 
    private server: ServiceProvider, 
    private core: CoreProvider, 
    private date: DateProvider,
    public loadingCtrl: LoadingController
  ) {
  
    this.updateSchedule( this.date.getToday() );
    this.core.dateSelectedPgAgendaObservable.subscribe({

      next: value => this.updateSchedule(value),
      error: error => console.log(error),
      complete: () => console.log('completo')
    });

    this.core.scheduleLoadedObservable.subscribe({

      next: value => {
        this.schedule = value
      },
      error: error => console.log(error),
      complete: () => console.log('completo')
    })
  }

  updateSchedule( date ){

    this.loading = this.loadingCtrl.create({

      content: 'Carregando agenda'
    })
    this.loading.present();
    this.server.send({

      method: 'loadAgendaDay',
      date: date
    })
      .then( res => {
        
        this.loading.dismiss();
        this.core.setScheduleLoaded( res ) 
      })
      .catch( res => {
        
        this.loading.dismiss();
        console.log( 'error' )
      })
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  }

  isGroupShown(group) {

      return this.shownGroup === group;
  }

}
