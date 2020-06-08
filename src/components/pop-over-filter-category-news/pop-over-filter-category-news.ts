import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CoreProvider, filterCategory } from '../../providers/core/core';
import { ServiceProvider } from '../../providers/service/service';

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

  constructor(public viewCtrl: ViewController, private core: CoreProvider, private service: ServiceProvider) {

  }

  updateCategoriesNewsSelected( category: filterCategory ){

    this.service.send({

      method: 'updateCategoriesNewsSelected',
      data: category
    })
    console.log('atualizar categories');
    console.log(category);
  }

  close() {

    this.viewCtrl.dismiss();
  }
}
