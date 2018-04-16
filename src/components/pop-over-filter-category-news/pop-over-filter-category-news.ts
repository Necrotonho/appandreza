import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CoreProvider } from '../../providers/core/core';

/**
 * Generated class for the PopOverFilterCategoryNewsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pop-over-filter-category-news',
  templateUrl: 'pop-over-filter-category-news.html'
})
export class PopOverFilterCategoryNewsComponent {

  constructor(public viewCtrl: ViewController, private core: CoreProvider) {

  }

  close() {

    this.viewCtrl.dismiss();
  }
}
