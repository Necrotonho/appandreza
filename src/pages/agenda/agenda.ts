import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { CoreProvider } from '../../providers/core/core';
import { DateProvider } from '../../providers/date/date';
import { UserProvider } from '../../providers/user/user';


@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html'
})
export class AgendaPage {

  private shownGroup = null;
  private schedule: [any];
  private lastUpdateDateSchedule;
  private observer;

  constructor(
    public navCtrl: NavController, 
    private server: ServiceProvider, 
    private core: CoreProvider, 
    private date: DateProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private user: UserProvider,
    private toastCtrl: ToastController
    
  ) {
  
    this.initOberserServer();
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

  initOberserServer(){

    let observer = {

      next: ( value ) => {

        if( value.request.method == 'updateScheduleByDay' && value.request.data[0].date == this.core.dateSelectedPgAgenda ){

          this.core.setScheduleLoaded( value.request.data );
          this.shownGroup = null;
          console.log( 'Chegou atualização da agenda' );
        }
      },
      error: ( error ) => console.log( 'error oberserver agenda: ' + error ),
      complete: () => console.log('observer agenda completo')
    }

    this.observer = this.server.observableServerWS.subscribe( observer );
  }

  getChangeSchedule( index ){

    if( this.schedule[ index ].available ){

      this.setSchedule( this.schedule[ index ] );
    }else{

      this.cancelSchedule( this.schedule[ index ] );
    }
  }

  setSchedule( schedule ){

    console.log('set Schedule');
    console.log(schedule);
    this.user.signIn()
      .then( res => {

        let loading = this.loadingCtrl.create({
    
          content: 'Confirmando agendamento'
        })
        loading.present();
        this.server.send({
    
          method: 'setSchedule',
          data: {
            date: schedule.date,
            hour: schedule.time
          }
        })
          .then( (res: any) => {
            
            loading.dismiss();
            this.presentToast( 'Agendamento realizado com sucesso' );
          })
          .catch( res => {
            
            loading.dismiss();
            this.presentConfirmErrorUpdateSchedule();
          })
      })
      .catch( res => this.presentToast( 'Você precisa estar logado' ) );
  }

  cancelSchedule( schedule ){

    let loading = this.loadingCtrl.create({

      content: 'Carregando'
    })
    loading.present();

    this.server.send({

      method: 'reasonForCancellation',
      data:{}
    })
      .then( (res:any) => {

        loading.dismiss();
        if( res ){

          console.log('retorno do servidor')
          console.log( res );
          schedule.listReasonForCancellation = res.request.data;
          this.presentReasonForCancellation( schedule );
        }
      })
      .catch( res => {

        loading.dismiss();
        console.log( 'erro no chamado do cancelamento');
      })

  }

  presentReasonForCancellation( schedule ){

    let alert = this.alertCtrl.create();
          alert.setTitle('Motivo do cancelamento');
      
          
          schedule.listReasonForCancellation.forEach( element => {
            

            alert.addInput({
              type: 'radio',
              label: element.description,
              value: element.id,
              checked: false,
            });
          });      
          alert.addButton('Cancel');
          alert.addButton({
            text: 'OK',
            handler: data => {
            
              let reasonForCancellation;
              let idOtherCancellation = '-1';
              data = {
                id: data,
                description: 'Default'
              }

              if( parseInt( data.id ) == parseInt( idOtherCancellation )){

                this.presentReasonForCancellationOther()
                  .then( (res:any) => {
                    
                    data.description = res.other;
                    schedule.reasonForCancellation = data;
                    this.startCancelSchedule( schedule );
                  })
                  .catch( res => {

                    console.log( 'deu merda no recebimento do motivo do cancelamento' );
                  })
              }else{

                schedule.reasonForCancellation = data;
                this.startCancelSchedule( schedule );
              }
            }
          });
          alert.present();

  }

  presentReasonForCancellationOther(){

    return new Promise( (resolve, reject) => {

      let alert = this.alertCtrl.create({
  
        title: 'Cancelamento',
        subTitle: 'Descreva abaixo o motivo do seu cancelamento',
        inputs: [
          {
            type: 'text',
            name: 'other',
            placeholder: 'Descrição'
          },
        ],
        buttons:[
          {
            text: 'Cancelar',
            handler: data => {
  
              if( data.other ){

                resolve( data );
              }else{

                this.presentReasonForCancellationOther()
                  .then( res => resolve( res ))
                  .catch( res => reject( res ))
              }
            }
          },
        ]
      });

      alert.present();
    })
  }

  startCancelSchedule( data ){

    let loading = this.loadingCtrl.create({

      content: 'Cancelando agendamento'
    })
    loading.present();
    this.server.send({

      method: 'cancelSchedule',
      data: {
        id: data.id,
        date: data.date,
        reasonForCancellation: data.reasonForCancellation 
      }
    })
      .then( (res: any) => {
        
        loading.dismiss();
        this.presentToast( 'Agendamento cancelado com sucesso' );
      })
      .catch( res => {
        
        loading.dismiss();
        this.presentConfirmErrorUpdateSchedule();//Corrigir essa mensagem  pra erro ao cancelar agendamento
      })
  }

  updateSchedule( date ){

    this.lastUpdateDateSchedule = date;
    let loading = this.loadingCtrl.create({

      content: 'Carregando agenda'
    })
    loading.present();
    this.server.send({

      method: 'updateScheduleByDay',
      data: { 
        date: date
      }
    })
      .then( (res: any) => {
        
        loading.dismiss();
        //this.core.setScheduleLoaded( res.request.data ) 
      })
      .catch( res => {
        
        loading.dismiss();
        this.presentConfirmErrorSetSchedule( res );
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

  presentConfirmErrorSetSchedule( msg ) {

    let alert = this.alertCtrl.create({
      title: 'Erro ao realizar agendamento',
      message: msg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.updateSchedule( this.lastUpdateDateSchedule );
          }
        }
      ]
    });
    alert.present();
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
