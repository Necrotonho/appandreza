import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { MyProfilePage } from '../my-profile/my-profile';
import { CoreProvider } from '../../providers/core/core';

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
    { title:'Cadastrar-se', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'create', show: true },
    { title:'Sair', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'exit', show: true  },

  ]

  constructor( 
    public navParams: NavParams,
    private core: CoreProvider
  ) {

    this.initName();
    this.core.userDataObservable.subscribe({

      next: ( res ) => {
        
        if( res.name ){

          this.name = res.name;
          this.pages.find( page => page.title == 'Meu dados' ).show = true;
        }else{
          
          this.pages.find( page => page.title == 'Meu dados' ).show = false;
          this.name = undefined;
        }
      }
    })
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad SideMenuPage');
  }

  openPage( page: PageInterface ){
  
    this.navCtrl.push( MyProfilePage );
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
