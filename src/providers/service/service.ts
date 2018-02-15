import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
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

    private obsServer = new Observable();
    private ws;

    constructor(public http: Http ) {

      setTimeout( ()=> {
        
        this.connect()
          .then( res => console.log('conectado') )
          .catch( res => console.log('Deu merda'));
      }, 3000);
    
    }

    private getRequestKey(){

    return new Date().getTime();
  }

  request( Dados ){


    return new Promise( (resolve, reject) => {

      let reerer = function(){

        let header = 'new header()';
        this.send('ddsa' );
        let obs = this.obsServer
          .subscribe()
          .filter( res => res.request.id == 'header.id')
          .map( res => resolve())
        resolve();
      }


      if( this.isConnected() ){

        
        reerer
      }else{

        this.connect()
          .then( res => {

            reerer
          })
          .catch( res => {

            reject('Erro ao Conectar');
          })
      }

    })
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
      this.ws.onopen = (res) => '';
      this.ws.onmessage = (res) => this.obsServer;
      this.ws.onclose = (res) => console.log('onClose');
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

    console.log('Chamou send');
    if( this.isConnected() ){

      this.ws.send(data);
    }else{

      this.connect()
        .then( res => this.ws.send(data) )
        .catch( res => {} );
    }
  }
  
  isConnected(){

    return this.ws.readyState == this.ws.OPEN ? true : false;
  }

  isConnecting(){

     return this.ws.CONNECTING == this.ws.readyState? true: false;
  }
}
