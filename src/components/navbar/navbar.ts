import { Component } from '@angular/core';
import { CoreProvider } from '../../providers/core/core';
import { MenuController } from 'ionic-angular';

/**
 * Generated class for the ToolbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'navbarComponent',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {

  name: String;
  constructor(
    private core: CoreProvider,
    public menuCtrl: MenuController
  ) {

    this.initName();
    this.core.userDataObservable.subscribe({

      next: ( res ) => {
      
        this.name = res.name
      }
    })
  }

  initName(){

    if( this.core.getUserData() && this.core.getUserData().name ){

      this.name = this.core.getUserData().name;
    }else{

      this.name = undefined;
      return false;
    }
  }

  toggleMenu() {

    // (click)="this.toggleMenu()"
    this.menuCtrl.toggle();
  }

}
