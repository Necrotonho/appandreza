import { Component } from '@angular/core';
import { AgendaPage } from '../../pages/agenda/agenda';
import { CoreProvider } from '../../providers/core/core';

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

  text: string;

  constructor( private agenda: AgendaPage, private core: CoreProvider ) {
    console.log('Hello PopOverOptPageMySchedulesComponent Component');
    this.text = 'Hello World';
  }

  cancelSchedule(){

    this.agenda.cancelSchedule( this.core.optSelectedScheduleOpt );
  }
}
