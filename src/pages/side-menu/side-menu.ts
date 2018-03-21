import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

export interface PageInterface {

  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-side-menu',
  templateUrl: 'side-menu.html',
})
export class SideMenuPage {

  rootPage = TabsPage;
  
  @ViewChild( Nav ) nav: Nav;

  pages: PageInterface[] = [

    {title:'Botão 1', pageName: 'tabsPagesss', tabComponent: 'Tab1Page', index: 0, icon: 'home'},
    {title:'Botão 2', pageName: 'tabsPagesss', tabComponent: 'Tab2Page', index: 1, icon: 'home'},
    {title:'Agenda', pageName: 'AgendaPage', icon: 'home'},

  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    console.log('carregou o side-menu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SideMenuPage');
  }

    openPage( page: PageInterface ){
    }

    isActive( page: PageInterface ){
    }

}
