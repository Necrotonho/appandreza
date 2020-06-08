import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { CoreProvider, UserInterface, RequestInterface } from '../../providers/core/core';
import { ServiceProvider } from '../../providers/service/service';
import { GetImageProvider } from '../../providers/get-image/get-image';

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
    private img: GetImageProvider,
    private actionSheetCtrl: ActionSheetController,
    private service: ServiceProvider,
    private core: CoreProvider,
  ) {

    this.userData = (this.core.getUserData() ? this.core.getUserData() : null);
    this.core.userDataObservable.subscribe({

      next: (res) => {

        this.userData = res;
      }
    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');

  }

  onChangeUserData() {

    if (JSON.stringify(this.userData) !== JSON.stringify(this.core.getUserData())) {

      this.service.send({

        method: 'updateUserData',
        data: this.userData
      }).then((res: RequestInterface) => {

        if (res.request.data.isUpdateUserData) {

          this.core.setUserData(this.userData);
        } else {

          this.presentToast('Erro ao atualizar dados');
        }
      }).catch(res => console.log('falha na requisição de atualização dos dados do usuario'))
    }

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

  chooseOptChangeImageAvatar() {

    let buttons = [];
    buttons.push({
      text: 'Camera',
      icon: 'camera',
      handler: () => {
        this.changeImageAvatar('camera');
      }
    })

    buttons.push({
      text: 'Biblioteca de fotos',
      icon: 'image',
      handler: () => {
        this.changeImageAvatar('file');
      }
    })

    buttons.push({
      text: 'Fechar',
      icon: 'close',
      role: 'cancel'
    })

    let actionSheet = this.actionSheetCtrl.create({

      title: 'Local de origem da foto',
      buttons: buttons
    });
    actionSheet.present();
  }

  changeImageAvatar(sourceType: string) {

    this.img.getImage(sourceType)
      .then(imagemCamera => {

        this.img.cropImgforAvatar(imagemCamera)
          .then((imagemCorte: string) => {

            this.img.getBase64Image(imagemCorte)
              .then((imagemBase64: any) => {

                this.core.userData.img = this.img.getImageSanitizer(imagemBase64)

                this.service.send({

                  method: 'changeImageAvatar',
                  data: { img: imagemBase64 }
                }).then((res: RequestInterface) => {

                  if (res.request.data.isChange) {

                    this.presentToast('Imagem atualizada');
                  } else {
                    this.presentToast('Erro ao salvar imagem no servidor')
                  }
                })
                  .catch((res: RequestInterface) => this.presentToast('Erro ao atualizar imagem'));
              })
              .catch(imagemBase64 => console.log('deu errado'))
          }).catch(imagemCorte => this.presentToast('Erro ao cortar imagem'))
      }).catch(imagemCamera => this.presentToast('Erro ao capturar imagem'))

  }

}
