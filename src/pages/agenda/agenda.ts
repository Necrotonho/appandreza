import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { CoreProvider } from '../../providers/core/core';
import { DateProvider } from '../../providers/date/date';


@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html'
})
export class AgendaPage {

  private shownGroup = null;
  private schedule: [Object];
  private lastUpdateDateSchedule;

  constructor(
    public navCtrl: NavController, 
    private server: ServiceProvider, 
    private core: CoreProvider, 
    private date: DateProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
  
    this.updateSchedule( this.date.getToday() );
    this.core.dateSelectedPgAgendaObservable.subscribe({

      next: value => this.updateSchedule( value ),
      error: error => console.log( error ),
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

    this.lastUpdateDateSchedule = date;
    let loading = this.loadingCtrl.create({

      content: 'Carregando agenda'
    })
    loading.present();
    this.server.send({

      method: 'loadAgendaDay',
      date: date
    })
      .then( res => {
        
        loading.dismiss();
        this.core.setScheduleLoaded( res ) 
      })
      .catch( res => {
        
        loading.dismiss();
        this.presentConfirmErrorUpdateSchedule();
      })
  }

  presentConfirmErrorUpdateSchedule() {

    let alert = this.alertCtrl.create({
      title: 'Erro ao carregar agenda',
      message: 'Não foi possível carregar agenda, verifique sua conexão  de internet e tente novamente',
      buttons: [
        {
          text: 'Tentar novamente',
          handler: () => {
            this.updateSchedule( this.lastUpdateDateSchedule );
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }

      ]
    });
    alert.present();
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
