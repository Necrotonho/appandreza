import { Component } from '@angular/core';
import { CoreProvider } from '../../providers/core/core';
import { MenuController, NavController, PopoverController } from 'ionic-angular';
import { FoodPlanContentPage } from '../../pages/food-plan-content/food-plan-content';
import { MySchedulesPage } from '../../pages/my-schedules/my-schedules';
import { PopOverFilterCategoryNewsComponent } from '../pop-over-filter-category-news/pop-over-filter-category-news';

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
    private navCtrl: NavController,
    private core: CoreProvider,
    public popoverCtrl: PopoverController,
    public menuCtrl: MenuController
  ) {

    this.initName();
    this.core.userDataObservable.subscribe({

      next: (res) => {

        if (res && res.name) {

          this.name = this.adjustName(res.name);
        } else {

          this.name = undefined;
        }
      }
    })
  }

  initName() {

    if (this.core.getUserData() && this.core.getUserData().name) {

      this.name = this.name = this.adjustName(this.core.getUserData().name);;
    } else {

      this.name = undefined;
      return false;
    }
  }

  getNavActive() {

    console.log(this.navCtrl.first().component.name)
  }

  adjustName(name) {

    return name ? name.split(' ')[0] : undefined;
  }

  toggleMenu() {

    // (click)="this.toggleMenu()"
    this.menuCtrl.toggle();
  }

  openPageMySchedule() {

    this.navCtrl.push(MySchedulesPage);
  }

  presentPopover(event) {

    let popover = this.popoverCtrl.create(PopOverFilterCategoryNewsComponent);
    popover.present({
      ev: event
    });
  }

}
