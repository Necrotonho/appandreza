import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { RequestInterface } from '../core/core';

/*
  Generated class for the ServicetesteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export interface SendInterface {

  method: string,
  data: any;
}


@Injectable()
export class ServiceProvider {


  // private localIp = 'ws://192.168.1.32:8000';
  private externalIP = 'ws://52.2.33.193:8000';
  private tentativasIP = [];
  private timeOutRequest = 15000;
  public appFocus: boolean;
  public ws: WebSocket;
  public observableServerWS: Subject<any> = new Subject();

  constructor(

    public http: Http,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {

  }

  private getRequestKey() {

    return new Date().getTime().toString() + (Math.random() * 1000);
  }

  private getVersion() {

    return '1.0.0';
  }

  private getToken() {

    if (localStorage.getItem('token') && (localStorage.getItem('isLoggedIn') == 'true' || localStorage.getItem('confirmNewUser') == 'true')) {

      return localStorage.getItem('token');
    } else {

      return localStorage.getItem('visitorToken');
    }
  }

  startMonitoringConnection() {

    setInterval(() => {

      let toast = this.toastCtrl.create({
        message: 'Conexão perdida, reconectando',
        position: 'top'
      });

      if (!this.appFocus) {

        // setTimeout( () => console.log('não tem focus'), 1000);
      }
      if (!this.isConnected() && !this.isConnecting() && this.appFocus) {

        toast.present();
        this.connect()
          .then(res => {

            localStorage.setItem('isLoggedIn', 'true');
            toast.dismiss();
          })
          .catch(res => toast.dismiss())
      }
    }, 3000);
  }

  request(dados) {

    return new Promise((resolve, reject) => {

      let requestData = {
        token: this.getToken(),
        request: {
          client: 1,
          id: this.getRequestKey(),
          version: this.getVersion(),
          method: dados.method,
          data: dados.data
        }
      };

      this.ws.send(JSON.stringify(requestData));

      let observer = {

        next: (value) => {

          if (value.request.id == requestData.request.id) {

            if (value.request.status.cod == '200') {

              clearTimeout(setTime);
              resolve(value);
              obs.unsubscribe();
            } else {

              clearTimeout(setTime);
              resolve(value);
              obs.unsubscribe();
            }
          } else {

            console.log('resposta de requisição não tem o mesmo ID');
          }
        },
        error: (value) => console.log('Erro no error do observer[Request]'),
        complete: () => console.log('resquest ' + requestData.request.id + ' completo')
      };

      let obs = this.observableServerWS.subscribe(observer);

      let setTime = setTimeout(() => {

        console.log('setTimeOut da requisição: ' + requestData.request.id);
        obs.unsubscribe();
        reject()
      }, this.timeOutRequest);
    });
  }

  toConnect() {

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({

        content: 'Conectando'
      })
      loading.present();
      this.connect()
        .then(res => {

          resolve();
          loading.dismiss();
          console.log('conectado no endereço: ' + res)
        })
        .catch(res => {

          reject();
          loading.dismiss();
          this.presentConfirmErrorToConnect();
          console.log(res);
          console.log('Nenhuma conexão possível com o servidor!');

        });
    })
  }

  connect() {

    return new Promise((resolve, reject) => {

      // this.initWS( this.localIp )
      //   .then( (res:WebSocket) => {
      //     this.ws = res 
      //     resolve( this.localIp );
      //   })
      //   .catch( res => reject() );

      this.initWS(this.externalIP)
        .then((res: WebSocket) => {
          this.ws = res
          resolve(this.externalIP);
        })
        .catch(res => reject());


      // let rejectConection = () => {

      //   if( this.tentativasIP.length ){

      //     this.connect()
      //       .then( res => {

      //         this.tentativasIP = [];
      //         localStorage.setItem('lastIpConnected', this.ws.url);
      //         resolve( this.ws.url );
      //       })
      //       .catch( res => {

      //         reject()
      //       });
      //   }else{

      //     reject();
      //   }
      // }


      // this.ws.onopen = (res) => {

      //   this.tentativasIP = [];
      //   let obs = this.observableServerWS.subscribe({

      //     next: (res) => {

      //       if( res.request.method == 'firstConnection' ){

      //         obs.unsubscribe();
      //         resolve( this.ws.url );
      //       }
      //     }
      //   });
      // }

      // this.ws.onmessage = ( msg:MessageEvent ) => {

      //   this.observableServerWS.next( JSON.parse( msg.data ) );

      //   if( JSON.parse( msg.data ).request.method == 'firstConnection' ){

      //     localStorage.setItem( 'visitorToken', JSON.parse( msg.data ).request.data.token );
      //   };
      // };

      // this.ws.onerror = (res) => {

      //   if( this.tentativasConection && !this.isConnected() ){

      //     localStorage.setItem('isLoggedIn', 'false' );
      //     reject();
      //   }else{

      //     rejectConection();
      //   }
      // };

      // this.ws.onclose = ( res ) => localStorage.setItem('isLoggedIn', 'false' );
    })
  }

  initWS(ip) {

    return new Promise((resolve, reject) => {

      let ws;
      ws = new WebSocket(ip);
      ws.onopen = (res) => {

        let obs = this.observableServerWS.subscribe({

          next: (res) => {

            if (res.request.method == 'firstConnection') {

              obs.unsubscribe();
              resolve(ws);
            }
          }
        });
      }

      ws.onmessage = (msg: MessageEvent) => {

        this.observableServerWS.next(JSON.parse(msg.data));

        if (JSON.parse(msg.data).request.method == 'firstConnection') {

          localStorage.setItem('visitorToken', JSON.parse(msg.data).request.data.token);
        };

        if (JSON.parse(msg.data).request.status.cod == "605") {

          localStorage.clear();
        }
      };

      ws.onerror = (res) => {

        let otherConnecting = this.tentativasIP.filter(ws => ws.CONNECTING);

        if (!otherConnecting.length && !this.isConnected()) {

          localStorage.setItem('isLoggedIn', 'false');
          reject();
        }

      };

      ws.onclose = (res) => {

        if (!this.isConnected) {

          localStorage.setItem('isLoggedIn', 'false')
        }

      };
      this.tentativasIP.push(ws);
    })

  }

  getIpConection() {

    if (localStorage.getItem('lastIpConnected') && !this.tentativasIP.length) {

      this.tentativasIP.push(localStorage.getItem('lastIpConnected'));
      return localStorage.getItem('lastIpConnected');
      // }
      // else if( this.tentativasIP.indexOf(this.externalIP) > -1 ){

      //   this.tentativasIP.push(this.localIp);
      //   console.log( this.tentativasIP );
      //   return this.localIp;
    } else {

      this.tentativasIP.push(this.externalIP);
      console.log(this.tentativasIP);
      return this.externalIP;
    }
  }

  send(data: SendInterface) {

    return new Promise((resolve, reject) => {

      if (this.isConnected()) {

        this.request(data)
          .then((res: RequestInterface) => resolve(res))
          .catch((res: RequestInterface) => reject(res));
      } else if (this.isConnecting()) {

        this.ws.onopen = () => {

          this.request(data)
            .then((res: RequestInterface) => resolve(res))
            .catch((res: RequestInterface) => reject(res));
        };
      } else {

        this.tentativasIP = [];
        this.toConnect()
          .then(res => {

            this.request(data)
              .then((res: RequestInterface) => resolve(res))
              .catch((res: RequestInterface) => reject(res));
          })
          .catch(res => reject(res));
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

  toClosed() {

    this.ws.close();
  }

  isConnected() {

    if (this.ws) {

      return this.ws.readyState == this.ws.OPEN ? true : false;
    } else {

      return false;
    }

  }

  isConnecting() {

    if (this.ws) {

      return this.ws.CONNECTING == this.ws.readyState ? true : false;
    } else {

      return false;
    }
  }

  presentToast(msg) {

    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
