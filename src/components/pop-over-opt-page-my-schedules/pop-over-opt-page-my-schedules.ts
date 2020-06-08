import { Component } from '@angular/core';
import { CoreProvider } from '../../providers/core/core';
import { ScheduleProvider } from '../../providers/schedule/schedule';

/**
 * Generated class for the PopOverOptPageMySchedulesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pop-over-opt-page-my-schedules',
  templateUrl: 'pop-over-opt-page-my-schedules.html'
})
export class PopOverOptPageMySchedulesComponent {

  constructor( private core: CoreProvider, public agenda: ScheduleProvider ) {

  }

  cancelSchedule(){

    this.agenda.presentCancelDefault( this.core.optSelectedScheduleOpt );
  }
}
