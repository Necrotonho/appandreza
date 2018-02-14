import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ServiceProvider } from '../service/service';
import { TokenProvider } from '../token/token';
/*
  Generated class for the RequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestProvider {

  private token: TokenProvider;
  private header;
  private params;

  constructor(public service: ServiceProvider) {
    
  }

}
