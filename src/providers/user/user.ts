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

    localStorage.setItem('isLoggedIn', 'false' );
    this.service.toConnect()
      .then( res => {
        
        this.startSignIn('')
          .then( res => localStorage.setItem('isLoggedIn', 'true' ) )
          .catch( res => console.log('erro ao conectar constructor class userprovider') )
      })
      .catch( res => console.log ('erro ao conectar ao servidor, no constructos da classe UserProvider') );

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
              
              this.signUp();
            }
          },
          {
            text: 'Entrar',
            handler: data => {
              
              this.startSignIn( data )
                .then( res => resolve() )
                .catch( res => reject( res ));
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
        .then( (res:any) => {
          
          if( res.request.data.isSignIn ){

            this.core.setUserData( res.request.data.user );
            localStorage.setItem('isLoggedIn', 'true' );
            localStorage.setItem('token', res.request.data.token );
            resolve();
          }else{

            console.log('caiu no reject do start signin');
            console.log( res.request.status.message );
            reject()
          }
        })
        .catch( res => console.log( 'erro no catch do Start Sign In'));
    });
  }

  signUp(){

    return new Promise( (resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Cadastro',
        inputs: [
          {
            name: 'name',
            placeholder: 'Nome',
            type: 'text'
          },
          {
            name: 'cpf',
            placeholder: 'CPF',
            type: 'number'
          },
          {
            name: 'phone',
            placeholder: 'Telefone',
            type: 'tel'
          },
          {
            name: 'email',
            placeholder: 'Email',
            type: 'email'
          },
          {
            name: 'password',
            placeholder: 'Senha',
            type: 'password'
          },
        ],
        buttons: [
          {
            text: 'Cadastrar',
            handler: data => {
              
              this.startSignUp( data );
            }
          }
        ]
      });
      
      alert.present();
    });
  }

  startSignUp( data ){

    //this.service.send(  )
    console.log( data );
  }

  isLoggedIn(){

    if( this.service.isConnected && ( localStorage.getItem('isLoggedIn') == 'true' ) ){

      return true;
    }else{
      
      return false;
    }
  }
}
