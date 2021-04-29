import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, NavController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushOptions, PushObject } from '@ionic-native/push';

import { TabsPage } from '../pages/tabs/tabs';
import { CoreProvider, RequestInterface } from '../providers/core/core';
import { UserProvider } from '../providers/user/user';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { ServiceProvider } from '../providers/service/service';

export interface PageInterface {

  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
  show?: boolean;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;

  @ViewChild(Nav) navCtrl: NavController;

  pages: PageInterface[] = [

    { title: 'Meus dados', pageName: 'tabsPagesss', tabComponent: 'Tab1Page', index: 0, icon: 'person', show: false },
    { title: 'Entrar', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'create', show: true },
    { title: 'Sair', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'exit', show: false },
    { title: 'Versão', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'exit', show: false },

  ]

  constructor(platform: Platform,
    private service: ServiceProvider,
    statusBar: StatusBar,
    public core: CoreProvider,
    private user: UserProvider,
    splashScreen: SplashScreen,
    public push: Push,
    public alertCtrl: AlertController,
    private serviceUser: UserProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(true);
      statusBar.styleLightContent();
      statusBar.show();
      splashScreen.hide();

      this.serviceUser.changeUserObs.subscribe({
        next: (res) => {

          this.pushsetup();
        }
      })

      this.push.hasPermission()
        .then((res: any) => {

          if (res.isEnabled) {
            console.log('We have permission to send push notifications');
          } else {
            console.log('We do not have permission to send push notifications');
          }

        })
    });

    this.core.userDataObservable.subscribe({

      next: (res) => {

        if (res && res.name) {

          // this.name = res.name;
          this.pages.find(page => page.title == 'Meus dados').show = true;
          this.pages.find(page => page.title == 'Sair').show = true;
          this.pages.find(page => page.title == 'Entrar').show = false;
        } else {

          this.pages.find(page => page.title == 'Meus dados').show = false;
          this.pages.find(page => page.title == 'Sair').show = false;
          this.pages.find(page => page.title == 'Entrar').show = true;
          // this.name = undefined;
        }
      }
    })
  }

  pushsetup() {

    const options: PushOptions = {
      android: {},
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
   };



    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => console.log('Notificação chegou', notification));

    pushObject.on('registration').subscribe((registration: any) => {

      setTimeout(() => {
        this.service.send({
          method: 'setFCMRegistrationId',
          data: registration
        })
        console.log('Device registered', registration)
      }, 3000)
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  openPage(page: PageInterface) {

    if (page.title == 'Entrar') {


      this.user.signIn()
      .then(()=>{

        this.user.initSession()
      })
    } else if (page.title == 'Sair') {

      this.user.signOut()
        .then(res => { })
        .catch(res => { })
    } else if (page.title == 'Meus dados') {

      this.navCtrl.push(MyProfilePage);
    }
  }

  isActive(page: PageInterface) {
  }

  // initName(){

  //   if( this.core.getUserData() && this.core.getUserData().name ){

  //     this.name = this.core.getUserData().name;
  //   }else{

  //     this.name = undefined;
  //     return false;
  //   }    
  // }
}
