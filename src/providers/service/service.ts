import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { LoadingController, AlertController } from 'ionic-angular';
//import { Message } from 'rxjs/Message';
/*
  Generated class for the ServicetesteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {


  private localIp = 'ws://192.168.1.32:8000';
  private externalIP    = 'ws://179.184.92.74:3396';
  private tentativasIP = [];
  private tentativasConection = 0;
  private timeOutRequest = 15000;
  private observer: Subject<any>;

  private obsServer = Observable.create(
    (observer: Observer<MessageEvent>) => {
      this.ws.onmessage = observer.next.bind(observer);
      this.ws.onerror = observer.error.bind(observer);
      this.ws.onclose = observer.complete.bind(observer);
      this.ws.close.bind(this.ws);
    });
  private ws;

  constructor(
    public http: Http, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
      
    this.toConnect();
  }

  private getRequestKey(){

    return new Date().getTime().toString(); 
  }

  private getVersion(){

    return '1.0.0';
  }
  
  request( Dados ){

    return new Promise( (resolve, reject) => {

      let requestData = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOiJzIn0.f3AdouopZEdhmkuFR77T023m0z1qYcem1OYCmxRzVLI',
        request: {
            id: this.getRequestKey(),
            version: this.getVersion(),
            method: Dados.method,
            data: Dados.date
          }
        };

      this.ws.send( JSON.stringify(requestData) );

      let observer = {

        next: (value) => {
          
          value = JSON.parse(value.data);

          if( value.request.id == requestData.request.id ){

            obr.complete(); 
            resolve(value);
          }else{

            console.log('resposta de requisição não tem o mesmo ID');
          }
        },
        error: ( value ) => console.log('Erro no error do observer[Request]'),
        complete: () => console.log('resquest ' + requestData.request.id + ' completo')
      };

      let obr = this.obsServer.subscribe(observer);
  
      setTimeout( () => reject(), this.timeOutRequest );
    });
  }

  toConnect(){

    let loading = this.loadingCtrl.create({

      content: 'Conectando'
    })
    loading.present();
    this.connect()
      .then( res => {
      
        loading.dismiss();
        console.log('conectado no endereço: ' + res ) 
      })
      .catch( res => {
        
        loading.dismiss();
        this.presentConfirmErrorToConnect();
        console.log( res );
        console.log('Nenhuma conexão possível com o servidor!');

      });
  }

  connect(){
    
    this.tentativasConection = 0;
    return new Promise( (resolve, reject) => {

      let rejectConection = () => {

        if( this.tentativasIP.length ){

          this.connect()
            .then( res => {
              
              resolve( this.ws.url ) 
            })
            .catch( res => {
              
              reject()
            });
        }else{

          reject();
        }
      }

      this.ws = new WebSocket( this.getIpConection() );
      this.ws.onopen = () => resolve( this.ws.url );
      this.ws.onerror = (res) => {
        
        if( this.tentativasConection && !this.isConnected() ){
          
          reject();
        }else{
          
          rejectConection();
        }
      };
    })
  } 

  getIpConection(){

    if( this.tentativasIP.indexOf(this.externalIP) > -1 ){

        this.tentativasIP.push(this.localIp);
        console.log( this.tentativasIP );
        this.tentativasIP = [];
        return this.localIp; 
    }else{

      this.tentativasIP.push(this.externalIP);
      console.log( this.tentativasIP );
      return this.externalIP;
    }
  }

  send(data){

    return new Promise( (resolve, reject) => {

      if( this.isConnected() ){

        this.request( data )
            .then( res => resolve( res ) )
            .catch( res => reject( res ) );
      }else if( this.isConnecting() ){

        console.log('conectando');
        this.ws.onopen = () =>{

          console.log('acabou de conectar');
          this.request( data )
              .then( res => resolve( res ) )
              .catch( res => reject( res ) );
        };
      }else{

        this.toConnect();
      }
    });
  }
  
  presentConfirmErrorToConnect() {

    let alert = this.alertCtrl.create({
      title: 'Erro ao conectar-se',
      message: 'Não foi possível conectar-se ao servidor, verifique sua conexão  de internet e tente novamente',
      buttons: [
        {
          text: 'Tentar novamente',
          handler: () => {
            this.toConnect();
          }
        }
      ]
    });
    alert.present();
  }

  isConnected(){

    return this.ws.readyState == this.ws.OPEN ? true : false;
  }

  isConnecting(){

     return this.ws.CONNECTING == this.ws.readyState? true: false;
  }
}
