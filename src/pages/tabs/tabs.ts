import { Component } from '@angular/core';

import { AgendaPage } from '../agenda/agenda';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AgendaPage;
  tab3Root = ContactPage;

  myIndex: number;

  constructor( public navCtrl: NavController ) {
    
  }
}
