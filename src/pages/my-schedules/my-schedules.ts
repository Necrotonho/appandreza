import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Platform } from 'ionic-angular';
import { PopOverOptPageMySchedulesComponent } from '../../components/pop-over-opt-page-my-schedules/pop-over-opt-page-my-schedules';
import { CoreProvider } from '../../providers/core/core';

/**
 * Generated class for the MySchedulesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-schedules',
  templateUrl: 'my-schedules.html',
})
export class MySchedulesPage {

  constructor(public navCtrl: NavController, 
              public platform: Platform,
              private core: CoreProvider,
              public popoverCtrl: PopoverController,
              public navParams: NavParams) {

    this.core.setMySchedule( [

      {
        id: 1234,
        date: ' 2018-01-01',
        time: '10h00 às 11h00',
        available: false,
        mySchedule: true,
        strAvailable: '',
        titleAdress: 'Edifício tal tal, sala nº tal',
        subTitleAdress: '14 S. Hop Avenue, Madison, WI 53703',
        destination: '14,14',
        imgDestination: 'img/predio.jpg'
      },
      {
        id: 1234,
        date: ' 2018-01-01',
        time: '10h00 às 11h00',
        available: false,
        mySchedule: true,
        strAvailable: '',
        titleAdress: 'Edifício tal tal, sala nº tal',
        subTitleAdress: '14 S. Hop Avenue, Madison, WI 53703',
        destination: '14,14',
        imgDestination: 'img/predio.jpg'
      },
    ] );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySchedulesPage');
  }

  openTraceRoute(){

    let destination = '14' + ',' + '14';

    if( this.platform.is( 'ios' ) ){

      window.open('maps://?q=' + destination, '_system');
    } else {

      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    }

  }

  presentPopover( event, idOpt ){

    this.core.optSelectedScheduleOpt = idOpt;
    let popover = this.popoverCtrl.create( PopOverOptPageMySchedulesComponent );
    popover.present({
      ev: event
    });
  }
}
