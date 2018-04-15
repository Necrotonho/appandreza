import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { CoreProvider, UserInterface, RequestInterface } from '../../providers/core/core';
import { Observer } from 'rxjs/Observer';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

  private userData: UserInterface;

  constructor(
    public navCtrl: NavController, 
    private toastCtrl: ToastController,
    public navParams: NavParams,
    private service: ServiceProvider,
    private core: CoreProvider,
  ) {
    
    this.userData =  ( this.core.getUserData() ?  this.core.getUserData() : null );
    this.core.userDataObservable.subscribe({

      next: (res) => {

        this.userData = res;
      }
    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
    
  }

  onChangeUserData(){

    if( JSON.stringify( this.userData ) !== JSON.stringify( this.core.getUserData() ) ){
      
      this.service.send({
        
        method:'updateUserData',
        data: this.userData
      }).then( ( res: RequestInterface ) => {
        
        if( res.request.data.isUpdateUserData ){
          
          this.core.setUserData( this.userData );
        }else{

          this.presentToast( 'Erro ao atualizar dados' );
        }
      }).catch( res => console.log('falha na requisição de atualização dos dados do usuario'))
    }

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
