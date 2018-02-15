import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
//import { Message } from 'rxjs/Message';
/*
  Generated class for the ServicetesteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {


  private localIp = 'ws://192.168.1.32:8000';
  private externalIP = 'ws://179.184.92.74:3396';
  private tentativasIP = [];
  private tentativasConection = 0;
  private timeOutRequest = 15000;
  private observer: Subject<any>;

  private obsServer = Observable.create(
    (observer: Observer<MessageEvent>) => {
      this.ws.onmessage = observer.next.bind(observer);
      this.ws.onerror = observer.error.bind(observer);
      this.ws.onclose = observer.complete.bind(observer);
      return this.ws.close.bind(this.ws);
    });
  private ws;

  constructor(public http: Http ) {

    setTimeout( ()=> {
      
      this.connect()
        .then( res => console.log('conectado') )
        .catch( res => console.log('Nenhuma conexão possível com o servidor!'));
    }, 3000);
  
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
            id: this.getRequestKey(),
            version: this.getVersion(),
            method: Dados.method,
            data: Dados.data
          };

      this.ws.send( requestData );

      let observer = {

        next: (value) => {
          
          if( value.request.id == requestData.id ){

            obr.complete(); 
            resolve(value);
          }
        },
        error: ( value ) => console.log('Erro no error do observer[Request]'),
        complete: () => console.log('resquest ' + requestData.id + ' completo')
      };

      let obr = this.obsServer.subscribe(observer);
  
      setTimeout( () => reject(), this.timeOutRequest );
    });
  }

  resquestConnected(){
    
      //resolve()

  }
  connect(){
    
    this.tentativasConection = 0;
    return new Promise( (resolve, reject) => {

      let rejectConection = () => {

        if( this.tentativasIP.length ){

          this.connect()
            .then( res => resolve() )
            .catch( res => {
              
              reject()
            });
        }else{

          reject();
        }
      }

      this.ws = new WebSocket( this.getIpConection() );
      // this.ws.onopen = (res) => '';
      // this.ws.onmessage = (res) => this.obsServer.;
      // this.ws.onclose = (res) => console.log('onClose');
      // this.ws.onerror = (res) => {
        
      //   if( this.tentativasConection && !this.isConnected() ){

      //     reject();
      //   }else{

      //     rejectConection();
      //   }
      // };
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

      console.log('Chamou send');
      if( this.isConnected() ){

        this.request(data)
          .then( res => resolve( res ) )
          .catch( res => reject( res ) );
      }else{

        this.connect()
          .then( res => this.ws.send(data) )
          .catch( res => {} );
      }
    });
  }
  
  isConnected(){

    return this.ws.readyState == this.ws.OPEN ? true : false;
  }

  isConnecting(){

     return this.ws.CONNECTING == this.ws.readyState? true: false;
  }
}
