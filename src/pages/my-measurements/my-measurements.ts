import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import { CoreProvider, RequestInterface, UsuarioMedidaInterface, UsuarioMedidaItem } from '../../providers/core/core';
import { ServiceProvider } from '../../providers/service/service';
import { DateProvider } from '../../providers/date/date';

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

  public measurements: UsuarioMedidaInterface[] = [];
  public loading = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private core: CoreProvider, private service: ServiceProvider, private dateProvider: DateProvider) {
  }

  ionViewDidLoad() {

    this.updateMeasures();
    // var myChart = HighCharts.chart('container', {
    //   chart: {
    //     type: 'line'
    //   },
    //   title: {
    //     text: 'Massa corporal'
    //   },
    //   xAxis: {
    //     categories: ['05/04/2018', '05/05/2018', '05/06/2018']
    //   },
    //   yAxis: {
    //     title: {
    //       text: 'Massa (Kg)'
    //     }
    //   },
    //   series: [{
    //     name: 'Massa corporal',
    //     data: [81, 75, 69]
    //   }, {
    //     name: 'Massa livre de gordura',
    //     data: [67, 66, 64]
    //   }, {
    //     name: 'Massa gordurosa',
    //     data: [14, 9, 5]
    //   }],
    //   credits: {
    //     enabled: false
    //   },
    // });
  }

  updateMeasures() {

    return new Promise((resolve, reject) => {

      this.service.send({
        method: 'updateMeasures',
        data: {
          idUser: this.core.userData.id
        }
      })
        .then((res: RequestInterface) => {

          this.measurements = res.request.data;

          console.log('measurements', this.measurements);
          setTimeout(() => {

            this.updateChart();
          }, 300);
          resolve();
        })
        .catch((res: RequestInterface) => {

          reject();
          console.log('erro ao atualizar updateMeasures', res);
        });
    });
  }

  updateChart() {

    this.measurements.forEach((m, i) => {

      let categories = [];
      let series = [];

      m.values.forEach(item => {

        const itemValue: any = item.value;
        categories.push(this.dateProvider.toBrazilDate(item.date));
        series.push(parseFloat(itemValue));
      });

      HighCharts.chart('container' + i, {
        chart: {
          type: 'column'
        },
        title: {
          text: m.descriptionMeasure
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          title: {
            text: m.descriptionMeasure + ' (' + m.unityMeasure + ')'
          }
        },
        series: [{
          name: m.descriptionMeasure,
          data: series,
          color: '#ec008c',
          cursor: 'pointer'
        }],
        credits: {
          enabled: false
        },
      });
    })
  }

}
