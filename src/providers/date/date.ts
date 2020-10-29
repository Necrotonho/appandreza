import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DateProvider {

  constructor(public http: Http) {
    console.log('Hello DateProvider Provider');
  }

  getToday(){

    let currentDate = new Date()
    let day = currentDate.getDate().toString().length == 1 ? '0' + currentDate.getDate() : currentDate.getDate();
    let month = (currentDate.getMonth() + 1).toString.length ? '0' + (currentDate.getMonth() + 1): currentDate.getMonth() + 1 
    let year = currentDate.getFullYear()
    let date = year + "-" + month + "-" + day;

    return date;
  }

  changeDate( date ){

    let newDate = date.split(' ')[0].split('-');

    if( newDate.length == 3 ){

      let hour = date.split(' ')[1]? ' ' + date.split(' ')[1] : '';
      return newDate[2] + '/' + newDate[1] + '/' + newDate[0].replace(/^\s+|\s+$/g,"") + hour  ;
    }else{

      return false
    }

  }

  compareHourNow( hour ){

    let hourNow = new Date();
    return parseFloat( hourNow.getHours()+'.'+hourNow.getMinutes() ) - ( parseFloat( hour.replace('h','.') ) )

  }

  toBrazilDate(dataServer) {

    const dataSplit = {
      data: dataServer.split(' ')[0],
      hora: dataServer.split(' ')[1]
    };

    const data = {
      dia: dataSplit.data.split('-')[2],
      mes: dataSplit.data.split('-')[1],
      ano: dataSplit.data.split('-')[0]
    };

    if (!parseInt(dataSplit.data, 10)) {

      return dataServer;
    }

    if (dataSplit.hora) {

      return data.dia + '/' + data.mes + '/' + data.ano + ' ' + dataSplit.hora;
    } else {

      return data.dia + '/' + data.mes + '/' + data.ano;
    }
  }

}
