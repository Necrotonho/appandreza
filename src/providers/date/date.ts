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

    var currentDate = new Date()
    var day = currentDate.getDate().toString.length ? '0' + currentDate.getDate() : currentDate.getDate();
    var month = (currentDate.getMonth() + 1).toString.length ? '0' + (currentDate.getMonth() + 1): currentDate.getMonth() + 1 
    var year = currentDate.getFullYear()
    return year + "-" + month + "-" + day

  }

}
