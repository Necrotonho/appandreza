import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import { CoreProvider } from '../../providers/core/core';

/**
 * Generated class for the MyMeasurementsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-measurements',
  templateUrl: 'my-measurements.html',
})
export class MyMeasurementsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private core: CoreProvider) {
  }

  ionViewDidLoad() {
    
    var myChart = HighCharts.chart('container', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Massa corporal'
      },
      xAxis: {
        categories: ['05/04/2018', '05/05/2018', '05/06/2018']
      },
      yAxis: {
        title: {
          text: 'Massa (Kg)'
        }
      },
      series: [{
        name: 'Massa corporal',
        data: [81, 75, 69]
      }, {
        name: 'Massa livre de gordura',
        data: [67, 66, 64]
      }, {
        name: 'Massa gordurosa',
        data: [14, 9, 5]
      }],
      credits: {
          enabled: false
      },
    });
  }

}
