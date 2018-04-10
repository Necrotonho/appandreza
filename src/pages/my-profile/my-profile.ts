import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreProvider, UserInterface } from '../../providers/core/core';
import { Observer } from 'rxjs/Observer';

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
    public navParams: NavParams,
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

    console.log( this.userData );
    console.log( this.core.getUserData() );
    console.log( this.userData === this.core.getUserData() );
  }


}
