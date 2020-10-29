import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Component } from '@angular/core';
import { DateProvider } from '../../providers/date/date';
import { CoreProvider } from '../../providers/core/core';

/**
 * Generated class for the DateSelectorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'date-selector',
  templateUrl: 'date-selector.html'
})
export class DateSelectorComponent {

  public dateStr: string;

  constructor(private date: DateProvider, private core: CoreProvider) {
    
    this.dateStr = this.date.getToday();
  }

  upDateDate(){

    this.core.setDateSelectedPgAgenda( this.dateStr );
  }

}