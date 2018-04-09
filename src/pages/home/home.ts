import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { ServiceProvider } from '../../providers/service/service';
import { CoreProvider } from '../../providers/core/core';
import { UserProvider } from '../../providers/user/user';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, 
              public service: ServiceProvider, 
              private platform: Platform,
              private splashscreen: SplashScreen,
              private core: CoreProvider, 
              private user: UserProvider) {

    platform.ready().then( () => splashscreen.hide() );
  } 

  doLogin(){

  }

  
}
