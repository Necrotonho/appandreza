import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../user/user';

/*
  Generated class for the ErrorsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ErrorsProvider {

  constructor(public http: Http, private user: UserProvider) {
    console.log('Hello ErrorsProvider Provider');
  }

  treatError( value ){

    return new Promise( (resolve, reject) => {

      if( value.request.status.cod == '606' ){
  
        this.user.signIn()
          .then
      }else if( value.request.status.cod == '602' ){

        
      }

    })

  }

}
