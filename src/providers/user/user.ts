import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CoreProvider, RequestInterface } from '../core/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../service/service';
import { FoodPlanProvider } from '../food-plan/food-plan';
import { DateProvider } from '../date/date';
import { BehaviorSubject } from 'rxjs';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  private attemptsConfirmUser: number;
  private limitattemptsConfirmUser: number = 5;
  public changeUserObs = new BehaviorSubject(this.core.userData);

  constructor(public http: Http,
    private core: CoreProvider,
    private alertCtrl: AlertController,
    private service: ServiceProvider,
    private foodPlanService: FoodPlanProvider,
    private date: DateProvider,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) {

    //localStorage.setItem('isLoggedIn', 'false' );
    // localStorage.removeItem('token');
    // localStorage.removeItem('visitorToken');

  }

  initOberserServer() {

    let observer = {

      next: (value) => {

        if (value.request.method == 'signIn') {

          if (value.request.data.isSignIn) {

            console.log('chegou atualização do initOberserServer User', value)
            this.core.setUserData(value.request.data.user);
          }
        }
      },
      error: (error) => console.log('error oberserver updateNews: ' + error),
      complete: () => console.log('observer updateNews completo')
    }

    this.service.observableServerWS.subscribe(observer);
  }

  signIn() {

    return new Promise((resolve, reject) => {

      if (this.isLoggedIn()) {

        this.changeUserObs.next(this.core.userData);
        resolve();
      } else {

        this.presentPrompt({})
          .then(res => resolve())
          .catch(res => reject());
      }
    })

  }

  initSession() {

    this.service.toConnect()
      .then(res => {

        this.service.send({

          method: 'updateCategoriesNews',
          data: {}
        }).then((res: RequestInterface) => {

          if (res.request.data && res.request.data.length) {

            this.core.setFilterCategories(res.request.data);
          }

          this.service.send({ method: 'updateNews', data: {} })
            .then((res: RequestInterface) => console.log('Chegou atualização de newss', res))
            .catch((res: RequestInterface) => console.log(res));
        })
          .catch((res: RequestInterface) => console.log(res));


        this.service.send({

          method: 'updateFoodPlan',
          data: {}
        }).then((res: any) => {

          this.foodPlanService.foodPlan = res.request.data;
          let nextFood = res.request.data[0].foodPlan.find(item => this.date.compareHourNow(item.hour) < 0);

          if (nextFood) {

            this.foodPlanService.foodPlanSelected = nextFood;
            this.core.setFoodPlanSelected(res.request.data[0]);
            this.foodPlanService.nextFoodSelected = nextFood.content;
            // this.relationship = res.request.data[0].title;
          }

        })
          .catch(res => console.log(res));

        this.service.send({

          method: 'updateMySchedules',
          data: {}
        }).then((res: RequestInterface) => {

          if (res.request.data && res.request.data.length) {

            this.core.setMySchedule(res.request.data);
          }
        })

        // this.service.startMonitoringConnection();
        if (localStorage.getItem('token')) {

          localStorage.setItem('isLoggedIn', 'true')
          this.startSignIn({ restartSignIn: false })
            .then(res => {

              this.service.send({

                method: 'updateMySchedules',
                data: {}
              }).then((res: RequestInterface) => {

                if (res.request.data && res.request.data.length) {

                  this.core.setMySchedule(res.request.data);
                }
              })
            }).catch(res => {

              localStorage.setItem('isLoggedIn', 'false');
              console.log('erro ao conectar constructor class userprovider')
            });
        }
      }).catch(res => console.log('erro ao conectar ao servidor, no constructos da classe UserProvider', res));

  }

  signOut() {

    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Sair',
        subTitle: 'Você tem certeza que deseja sair?',
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {

            }
          },
          {
            text: 'Sim',
            handler: data => {

              this.core.setUserData({ cpf: '', email: '', id: 0, name: '', phone: '', img: '' });
              localStorage.removeItem('token');
              localStorage.setItem('isLoggedIn', 'false');
              resolve();
            }
          }
        ]
      });

      alert.present();
    })
  }

  presentPrompt(data) {

    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Login',
        inputs: [
          {
            name: 'cpf',
            placeholder: 'CPF',
            type: 'tel',
            value: data.cpf ? data.cpf : ''
          },
          {
            name: 'password',
            placeholder: 'Senha',
            type: 'password',
            value: data.password ? data.password : ''
          }
        ],
        buttons: [
          {
            text: 'Esqueci a senha',
            handler: data => {

              this.forgotPassword()
                .then(res => {

                  this.presentToast('Senha recuperada com sucesso')
                  resolve();
                })
                .catch(res => this.presentToast('Erro ao recuperar senha'));
            }
          },
          {
            text: 'Cadastrar-se',
            handler: data => {

              this.signUp({})
                .then(res => {

                  this.startSignIn({ restartSignIn: true })
                    .then(res => resolve())
                    .catch(res => reject(res))
                })
                .catch(res => reject());
            }
          },
          {
            text: 'Entrar',
            handler: data => {

              data.restartSignIn = true;
              this.startSignIn(data)
                .then(res => resolve())
                .catch(res => reject(res));
            }
          },
        ]
      });

      alert.present();
    });
  }

  presentToast(msg) {

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

  forgotPassword() {

    return new Promise((resolve, reject) => {

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

              this.startforgotPassword(data)
                .then(res => resolve())
                .catch(res => reject())
            }
          }
        ]
      });

      alert.present();
    });

  }

  startforgotPassword(data) {

    let loading = this.loadingCtrl.create({

      content: 'Enviando email de confirmação'
    })
    loading.present();

    return new Promise((resolve, reject) => {

      this.service.send({

        method: 'generateNewKey',
        data: {
          cpf: data.cpf,
        }
      })
        .then((res: any) => {

          loading.dismiss();
          if (res.request.data.isKey) {

            res.request.data.cpf = data.cpf;
            this.verifyCodPassword(res.request.data)
              .then(res => {

                localStorage.setItem('isLoggedIn', 'true');
                this.presentToast('Senha recuperada com sucesso');
                this.startSignIn({ restartSignIn: true })
                  .then(res => resolve())
                  .catch(res => reject())//Verificar isso mais tardes
              })
              .catch(res => console.log('cod incorreto'))
          } else {

            reject()
          }
        })
        .catch(res => {

          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Erro!',
            subTitle: 'Erro ao enviar email de confirmação!',
            buttons: ['OK']
          });
          alert.present();
          console.log('erro no catch do Start Sign In')
        });
    });
  }

  verifyCodPassword(data) {

    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Esqueci a senha',
        subTitle: 'Foi enviado para o email ' + data.email + ' um código com 4 dígitos,  informe-o abaixo, juntamente com sua nova senha',
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
            handler: data2 => {

              // data.password = data2.password;
              // data.cod = data2.cod;
              this.startConfirmNewPassword(data2)
                .then(res => resolve())
                .catch(res => {

                  this.verifyCodPassword(data.email)
                    .then(res => resolve())
                    .catch(res => reject())
                })
            }
          }
        ]
      });

      alert.present();
    });

  }

  startConfirmNewPassword(data) {

    let loading = this.loadingCtrl.create({

      content: 'Verificando'
    })
    loading.present();

    return new Promise((resolve, reject) => {

      this.service.send({

        method: 'recoverPassword',
        data: {
          cod: data.cod,
          password: data.password
        }
      }).then((res: any) => {

        loading.dismiss();
        if (res.request.data.isRecovered) {

          localStorage.setItem('token', res.request.data.token);
          resolve();
        } else {

          reject()
        }
      })
        .catch(res => {

          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Erro!',
            subTitle: 'Erro ao verificar email!',
            buttons: ['OK']
          });
          alert.present();
          console.log('erro no startConfirmNewPassword')
        });
    });
  }

  startSignIn(data) {

    return new Promise((resolve, reject) => {

      this.service.send({

        method: 'signIn',
        data: {
          user: data.cpf ? data.cpf : undefined,
          password: data.password ? data.password : undefined
        }
      })
        .then((res: any) => {

          if (res.request.data.isSignIn) {

            this.core.setUserData(res.request.data.user);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', res.request.data.token);
            resolve();
          } else {

            if (localStorage.getItem('token')) {

              localStorage.removeItem('token')
            }
            if (res.request.status.message) {
              const toast = this.toastCtrl.create({
                message: res.request.status.message,
                duration: 3000
              });
              toast.present();
            }
            if (data.restartSignIn) {

              this.presentPrompt(data)
                .then(res => {

                  localStorage.setItem('isLoggedIn', 'true');
                  resolve()
                })
                .catch(res => reject());
            }
          }
        })
        .catch(res => console.log('erro no catch do Start Sign In', res));
    });
  }

  signUp(dados) {

    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Cadastro',
        inputs: [
          {
            value: dados.name ? dados.name : '',
            name: 'name',
            placeholder: 'Nome',
            type: 'text'
          },
          {
            value: dados.cpf ? dados.cpf : '',
            name: 'cpf',
            placeholder: 'CPF',
            type: 'number'
          },
          {
            value: dados.phone ? dados.phone : '',
            name: 'phone',
            placeholder: 'Telefone',
            type: 'tel'
          },
          {
            value: dados.email ? dados.email : '',
            name: 'email',
            placeholder: 'Email',
            type: 'email'
          },
          {
            value: dados.password ? dados.password : '',
            name: 'password',
            placeholder: 'Senha',
            type: 'password'
          },
        ],
        buttons: [
          {
            text: 'Cadastrar',
            handler: data => {

              if (this.validateEmail(data.email).isValid) {

                this.startSignUp(data)
                  .then(res => resolve())
                  .catch(res => reject())
              } else {

                dados = data;
                this.presentToast(this.validateEmail(data.email).message)
                this.signUp(dados)
                  .then(res => resolve())
                  .catch(res => reject())
              }

            }
          }
        ]
      });

      alert.present();
    });
  }

  startSignUp(data) {

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({

        content: 'Cadastrando'
      })
      loading.present();

      this.service.send({

        method: 'setUser',
        data: data
      })
        .then((res: any) => {

          loading.dismiss();
          if (res.request.data.isUser) {

            localStorage.setItem('token', res.request.data.token);
            localStorage.setItem('confirmNewUser', 'true');
            this.attemptsConfirmUser = 0;
            this.confirmUser()
              .then(res => {

                console.log('data', data);
                this.startSignIn(data);
                resolve();
              })
              .catch(res => {

                //this.presentToast( 'Erro na confirmação do usuário' )
                reject();
              })
          } else {

            this.presentToast(res.request.status.message);
            this.signUp(data);
          }
        })
        .catch(res => {

          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Erro!',
            subTitle: 'Erro ao realizar o cadastro!',
            buttons: ['OK']
          });
          alert.present();
          console.log('deu merda no cadastro');
        })
    })
  }

  confirmUser() {

    return new Promise((resolve, reject) => {

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

              this.startConfirmUser(data)
                .then(res => resolve())
                .catch(res => {

                  if ((this.attemptsConfirmUser <= this.limitattemptsConfirmUser)) {

                    this.attemptsConfirmUser++;
                    this.presentToast(res.request.status.message);
                    this.confirmUser()
                      .then(res => {

                        localStorage.removeItem('confirmNewUser');
                        resolve()
                      })
                      .catch(res => reject(res))
                  } else {

                    this.presentToast('Número se tentativas excedidas, refaça o login');
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

  startConfirmUser(dados) {

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({

        content: 'Confirmando'
      })
      loading.present();
      this.service.send({

        method: 'confirmUser',
        data: dados
      })
        .then((res: any) => {

          loading.dismiss();
          if (res.request.data.isConfirmed) {

            this.presentToast('Cadastro finalizado com sucesso');
            resolve();
          } else {

            reject(res);
          }
        })
        .catch(res => {

          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Erro!',
            subTitle: 'Erro ao finalizar o cadastro!',
            buttons: ['OK']
          });
          alert.present();
          console.log(res)
        })
    })

  }

  isLoggedIn() {

    if (this.service.isConnected && (localStorage.getItem('isLoggedIn') == 'true')) {

      return true;
    } else {

      return false;
    }
  }

  validateEmail(email) {

    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return {
        isValid: true,
        message: ''
      };
    } else {
      return {

        isValid: false,
        message: 'Insira um email válido'
      }
    }
  }


}
