import { Component } from '@angular/core';
import { CoreProvider } from '../../providers/core/core';

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

  name: string;
  constructor(private core: CoreProvider) {

    this.core.userDataObservable.subscribe({

      next: ( res ) => {
      
        this.name = res.name
      }
    })
  }

}
