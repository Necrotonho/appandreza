import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { MyProfilePage } from '../my-profile/my-profile';
import { CoreProvider } from '../../providers/core/core';
import { UserProvider } from '../../providers/user/user';

export interface PageInterface {

  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
  show?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-side-menu',
  templateUrl: 'side-menu.html',
})
export class SideMenuPage {

  name: any;  
  rootPage = TabsPage;
  
  @ViewChild( Nav ) navCtrl: NavController;

  pages: PageInterface[] = [

    { title:'Meu dados', pageName: 'tabsPagesss', tabComponent: 'Tab1Page', index: 0, icon: 'person', show: false },
    { title:'Entrar', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'create', show: true },
    { title:'Sair', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'exit', show: false  },

  ]

  constructor( 
    public navParams: NavParams,
    private core: CoreProvider,
    private user: UserProvider,
  ) {

    this.initName();
    this.core.userDataObservable.subscribe({

      next: ( res ) => {
        
        if( res && res.name ){

          this.name = res.name;
          this.pages.find( page => page.title == 'Meu dados' ).show = true;
          this.pages.find( page => page.title == 'Sair' ).show = true;
          this.pages.find( page => page.title == 'Entrar' ).show = false;
        }else{
          
          this.pages.find( page => page.title == 'Meu dados' ).show = false;
          this.pages.find( page => page.title == 'Sair' ).show = false;
          this.pages.find( page => page.title == 'Entrar' ).show = true;
          this.name = undefined;
        }
      }
    })
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad SideMenuPage');
  }

  openPage( page: PageInterface ){
  
    if( page.title == 'Entrar' ){

      this.user.signIn()
    }else if( page.title == 'Sair' ){

      this.user.sginOut()
        .then( res => {})
        .catch( res => {})
    }
    //this.navCtrl.push( MyProfilePage );
  }

  isActive( page: PageInterface ){
  }

  initName(){

    if( this.core.getUserData() && this.core.getUserData().name ){

      this.name = this.core.getUserData().name;
    }else{

      this.name = undefined;
      return false;
    }    
  }

}
