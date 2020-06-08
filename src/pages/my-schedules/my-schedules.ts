import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Platform, ToastController } from 'ionic-angular';
import { PopOverOptPageMySchedulesComponent } from '../../components/pop-over-opt-page-my-schedules/pop-over-opt-page-my-schedules';
import { CoreProvider, RequestInterface, scheduleItem } from '../../providers/core/core';
import { ServiceProvider } from '../../providers/service/service';
import { DateProvider } from '../../providers/date/date';
import { ScheduleProvider } from '../../providers/schedule/schedule';

/**
 * Generated class for the MySchedulesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-schedules',
  templateUrl: 'my-schedules.html',
})
export class MySchedulesPage {

  constructor(public navCtrl: NavController, 
              public platform: Platform,
              public date: DateProvider, 
              private core: CoreProvider,
              private toastCtrl: ToastController,
              private schedule: ScheduleProvider,
              public service: ServiceProvider,
              public popoverCtrl: PopoverController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    
    this.schedule.updateMySchedules()
    this.core.mySchedules
  }
  openTraceRoute( d ){

    if( this.platform.is( 'ios' ) ){

      window.open('http://maps.apple.com/?sll=' + d.destination, '_system');
    } else {

      let label = encodeURI(d.titleAdress);
      window.open('geo:0,0?q=' + d.destination + '(' + label + ')', '_system');

    }

  }

  presentPopover( event, idOpt ){

    this.core.optSelectedScheduleOpt = idOpt;
    let popover = this.popoverCtrl.create( PopOverOptPageMySchedulesComponent );
    popover.present({
      ev: event
    });
  }

  confirmPresence( schedule: scheduleItem ){

    this.service.send({

      method: 'setConfirmedSchedule',
      data: schedule
    })
    .then( ( res: RequestInterface ) => {

      if( res.request.data.isSetConfirmedSchedule ){

        this.presentToast( 'Confirmação de presença realizada com sucesso' );
        this.ionViewDidLoad()
      }else{
        
        this.presentToast( 'Erro ao realizar confirmação' );
      }
    })
    .catch( ( res: RequestInterface ) => {

      console.log(res);
      this.presentToast( 'Erro ao realizar procedimento' );
    })
  }

  presentToast( msg ) {

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
}
