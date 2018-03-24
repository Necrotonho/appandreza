import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreProvider } from '../../providers/core/core';

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

  userData;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private core: CoreProvider,
  ) {
    
    this.userData =  ( this.core.getUserData() ?  this.core.getUserData() : null );
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }


}
