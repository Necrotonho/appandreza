import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ServiceProvider } from '../../providers/service/service';
import { CoreProvider } from '../../providers/core/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public service: ServiceProvider, private core: CoreProvider) {

    
  } 

}
