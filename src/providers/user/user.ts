import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CoreProvider } from '../core/core';
import { AlertController } from 'ionic-angular';
import { ServiceProvider } from '../service/service';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(  public http: Http, 
                private core: CoreProvider, 
                private alertCtrl: AlertController, 
                private service: ServiceProvider
  ){

    console.log('Hello UserProvider Provider');

  }

  signIn(){

    return new Promise( (resolve, reject) => {

      if( this.isLoggedIn() ){
  
        resolve();
      }else{
        
        this.presentPrompt()
          .then( res => resolve() )
          .catch( res => reject() );
      }
    })

  }

  presentPrompt() {

    return new Promise( (resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Login',
        inputs: [
          {
            name: 'cpf',
            placeholder: 'CPF',
            type: 'number'
          },
          {
            name: 'password',
            placeholder: 'Senha',
            type: 'password'
          }
        ],
        buttons: [
          {
            text: 'Esqueci a senha',
            handler: data => {
              
              this.isLoggedIn();
            }
          },
          {
            text: 'Cadastrar-se',
            handler: data => {
              
              console.log('chamou login');
            }
          },
          {
            text: 'Entrar',
            handler: data => {
              
              this.startSignIn( data )
                .then( res => console.log( data ));
            }
          },
        ]
      });
      
      alert.present();
    });
  }

  startSignIn( data ){

    return new Promise( (resolve, reject) => {

      this.service.send({

        method: 'signin',
        data: {
          user: data.cpf,
          password: data.password
        }
      })
        .then( res => resolve() );
    });
  }
  signUp(){

    return new Promise( (resolve, reject) => {

      
    });
  }

  isLoggedIn(){

    return false;
    // if( atob('dGVzdGU=') == 'teste' ){

    //   return true;
    // }else{

    //   return false;
    // }
  }
}
