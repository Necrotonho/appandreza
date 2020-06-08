import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ServiceProvider } from '../service/service';
import { RequestInterface, scheduleItem, reasonForCancellationInterface, CoreProvider } from '../core/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';

/*
  Generated class for the ScheduleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ScheduleProvider {

  constructor(public http: Http,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private core: CoreProvider,
              public loadingCtrl: LoadingController,
              public service: ServiceProvider
  ) {
    console.log('Hello ScheduleProvider Provider');
  }


  loadReasonForCancellation( ){

    return new Promise( (resolve,  reject) => {

      this.service.send({
  
        method: 'reasonForCancellation',
        data:{}
      })
        .then( ( res: RequestInterface ) => {
  
          if( res.request.data ){
            
            resolve( res.request.data );
          }

          resolve();
        })
        .catch( res => reject())
    })
  }

  cancelSchedule( schedule: scheduleItem ){

    return new Promise( (resolve, reject) => {

      this.service.send({
    
        method: 'cancelSchedule',
        data: {
          id: schedule.id,
          date: schedule.date,
          reasonForCancellation: schedule.reasonForCancellation 
        }
      })
        .then( ( res: RequestInterface ) => {
          
          if( res.request.data.isScheduleCanceled ){

            resolve();
          }else{

            reject();
          }
        })
        .catch( res => reject() );
    });
  }

  presentCancelDefault( schedule: scheduleItem ){

    return new Promise( (resolve,  reject) => {

      let loading = this.loadingCtrl.create({

        content: 'Cancelando agendamento'
      })
      loading.present();

      this.loadReasonForCancellation()
        .then( ( res: reasonForCancellationInterface[] ) => {
          
          loading.dismiss();
          schedule.reasonForCancellation = res 
          this.presentReasonForCancellation( schedule );
        })
        .catch( ( res: reasonForCancellationInterface[] ) => {
          
          this.presentToast( 'Erro ao iniciar processo de cancelamento' ) 
          loading.dismiss();        
        })

    });
  }

  presentReasonForCancellation( schedule ){

    let alert = this.alertCtrl.create();
        alert.setTitle( 'Motivo do cancelamento' );
        schedule.reasonForCancellation.forEach( element => {
          
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

  startCancelSchedule( schedule ){

    let loading = this.loadingCtrl.create({

      content: 'Cancelando agendamento'
    })
    loading.present();
    this.cancelSchedule( schedule )
    .then( (res: RequestInterface ) => {

        loading.dismiss();
        this.presentToast( 'Agendamento cancelado com sucesso' );
        this.updateMySchedules()
    })
    .catch( ( res: RequestInterface ) => {

      loading.dismiss();
      this.presentToast( 'Erro ao realizar o cancelamento' );
    })

  }

  updateMySchedules(){

    this.service.send({

      method: 'updateMySchedules',
      data: {}
    })
    .then( (res: RequestInterface) => {

      if( res.request.data && res.request.data.length ){

        this.core.setMySchedule( res.request.data );
      }else{
        
        this.core.setMySchedule( undefined );
      }
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
