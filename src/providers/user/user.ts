import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CoreProvider } from '../core/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../service/service';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  private attemptsConfirmUser: number;
  private limitattemptsConfirmUser: number = 5;

  constructor(  public http: Http, 
                private core: CoreProvider, 
                private alertCtrl: AlertController, 
                private service: ServiceProvider,
                private toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
  ){

    localStorage.setItem('isLoggedIn', 'false' );
    //localStorage.removeItem('token');
    //localStorage.removeItem('visitorToken');
    this.service.toConnect()
      .then( res => {
        
        this.startSignIn( {restartSignIn: false} )
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
        
        this.presentPrompt( {} )
          .then( res => resolve() )
          .catch( res => reject() );
      }
    })

  }

  presentPrompt( data ) {

    return new Promise( (resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Login',
        inputs: [
          {
            name: 'cpf',
            placeholder: 'CPF',
            type: 'number',
            value: data.cpf? data.cpf: false
          },
          {
            name: 'password',
            placeholder: 'Senha',
            type: 'password',
            value: data.password? data.password: false
          }
        ],
        buttons: [
          {
            text: 'Esqueci a senha',
            handler: data => {
              
              this.forgotPassword()
                .then( res => {
                  
                  this.presentToast( 'Senha recuperada com sucesso' )
                  resolve();
                })
                .catch( res => this.presentToast( 'Erro ao recuperar senha' ));
            }
          },
          {
            text: 'Cadastrar-se',
            handler: data => {
              
              this.signUp( {} )
                  .then( res => {
                    
                    this.startSignIn( {restartSignIn: true} )
                        .then( res => resolve() )
                        .catch( res => reject( res ) )
                  })
                  .catch( res => reject() );
            }
          },
          {
            text: 'Entrar',
            handler: data => {
              
              data.restartSignIn = true;
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

  forgotPassword(){

    return new Promise( (resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Esqueci a senha',
        subTitle: 'Informa abaixo seu CPF',
        inputs: [
          {
            name: 'cpf',
            placeholder: 'CPF',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'recuperar senha',
            handler: data => {
              
              this.startforgotPassword( data )
                .then( res => resolve() )
                .catch( res => reject() )
            }
          }
        ]
      });
      
      alert.present();
    });
    
  }

  startforgotPassword( data ){

    let loading = this.loadingCtrl.create({

      content: 'Enviando email de confirmação'
    })
    loading.present();

    return new Promise( (resolve, reject) => {

      this.service.send({

        method: 'generateNewKey',
        data: {
          cpf: data.cpf,
        }
      })
        .then( (res:any) => {
          
          loading.dismiss();
          if( res.request.data.isKey ){

            this.verifyCodPassword( res.request.data.email )
              .then( res => {
                
                this.presentToast( 'Senha recuperada com sucesso' );
                this.startSignIn( {restartSignIn: true} )
                  .then( res => resolve() )
                  .catch( res => reject() )//Verificar isso mais tardes
              })
              .catch( res => console.log('cod incorreto') )
          }else{

            reject()
          }
        })
        .catch( res => {
         
          loading.dismiss();
          console.log( 'erro no catch do Start Sign In')
        });
    });
  }

  verifyCodPassword( email ){

    return new Promise( (resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Esqueci a senha',
        subTitle: 'Foi enviado para o email ' + email + ' um código com 4 dígitos,  informe-o abaixo, juntamente com sua nova senha',
        inputs: [
          {
            name: 'cod',
            placeholder: 'Código',
            type: 'number'
          },
          {
            name: 'password',
            placeholder: 'Nova senha',
            type: 'text'
          },
        ],
        buttons: [
          {
            text: 'Confirmar nova senha',
            handler: data => {
              
              this.startConfirmNewPassword( data )
                .then( res => resolve() )
                .catch( res => {
                  
                  this.verifyCodPassword( email )
                    .then( res => resolve() )
                    .catch( res => reject() )
                })
            }
          }
        ]
      });
      
      alert.present();
    });

  }

  startConfirmNewPassword( data ){

    let loading = this.loadingCtrl.create({

      content: 'Verificando'
    })
    loading.present();

    return new Promise( (resolve, reject) => {

      this.service.send({

        method: 'recoverPassword',
        data: {
          cod: data.cod,
          password: data.password
        }
      })
        .then( (res:any) => {
          
          loading.dismiss();
          if( res.request.data.isRecovered ){

            localStorage.setItem('token', res.request.data.token );
            resolve();
          }else{
            
            reject()
          }
        })
        .catch( res => {
          
          loading.dismiss();
          console.log( 'erro no startConfirmNewPassword')
        });
    });
  }

  startSignIn( data ){

    return new Promise( (resolve, reject) => {

      this.service.send({

        method: 'signIn',
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

            if( data.restartSignIn ){

              this.presentPrompt( data )
                .then( res => resolve() )
                .catch( res => reject() );
            }
          }
        })
        .catch( res => console.log( 'erro no catch do Start Sign In'));
    });
  }

  signUp( dados ){

    return new Promise( (resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Cadastro',
        inputs: [
          {
            name: 'name',
            placeholder: dados.name? dados.name: 'Nome',
            type: 'text'
          },
          {
            name: 'cpf',
            placeholder: dados.cpf? dados.cpf: 'CPF',
            type: 'number'
          },
          {
            name: 'phone',
            placeholder: dados.phone? dados.phone: 'Telefone',
            type: 'tel'
          },
          {
            name: 'email',
            placeholder: dados.email? dados.email: 'Email',
            type: 'email'
          },
          {
            name: 'password',
            placeholder: dados.password? dados.password: 'Senha',
            type: 'password'
          },
        ],
        buttons: [
          {
            text: 'Cadastrar',
            handler: data => {
              
              this.startSignUp( data )
                .then( res => resolve() )
                .catch( res => reject() )
            }
          }
        ]
      });
      
      alert.present();
    });
  }

  startSignUp( data ){

    return new Promise( (resolve, reject) => {

      this.service.send({
  
        method: 'setUser',
          data: data
      })
      .then( (res:any) => {
        
        if( res.request.data.isUser ){
  
          localStorage.setItem('token', res.request.data.token );
          this.attemptsConfirmUser = 0;
          this.confirmUser()
              .then( res =>{

                resolve();
              })
              .catch( res => {

                //this.presentToast( 'Erro na confirmação do usuário' )
                reject();  
              })
        }else{

          this.presentToast( res.request.status.message );
          this.signUp( data );
        }
      })
      .catch( res => console.log('deu merda no cadastro'))
    })
  }

  confirmUser( ){

    return new Promise ( (resolve, reject) =>{

      let alert = this.alertCtrl.create({
        title: 'Confirmação de email',
        subTitle: 'Foi enviado para seu email um código de 4 digitos, informe-o abaixo',
        inputs: [
          {
            name: 'cod',
            placeholder: '4 dígitos',
            type: 'number'
          }
        ],
        buttons: [
          {

            text: 'Cancelar',
            handler: data => {

              reject();
            }
          },
          {
            text: 'Finalizar cadastro',
            handler: data => {
              
              this.startConfirmUser( data )
                  .then( res => resolve() )
                  .catch( res => {

                    if( ( this.attemptsConfirmUser <= this.limitattemptsConfirmUser ) ){

                      this.attemptsConfirmUser ++;
                      this.presentToast( res.request.status.message );
                      this.confirmUser()
                        .then( res => resolve() )
                        .catch( res => reject( res ) )
                    }else{

                      this.presentToast( 'Número se tentativas excedidas, refaça o login' );
                      reject();
                    }
                  });
            }
          }
        ]
      });
      
      alert.present();
    })
  }

  startConfirmUser( dados ){

    return new Promise ( (resolve, reject) =>{

      this.service.send({

        method: 'confirmUser',
        data: dados
      })
        .then( (res:any) => {

          if( res.request.data.isConfirmed ){

            this.presentToast( 'Cadastro finalizado com sucesso' );
            resolve();
          }else{
            
            reject( res );
          }
        })
        .catch( res => console.log( res ) )
    })

  }

  isLoggedIn(){

    if( this.service.isConnected && ( localStorage.getItem('isLoggedIn') == 'true' ) ){

      return true;
    }else{
      
      return false;
    }
  }

}
