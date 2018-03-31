import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { DateSelectorComponent } from './../components/date-selector/date-selector';
import { NavbarComponent } from '../components/navbar/navbar'
import { AgendaPage } from '../pages/agenda/agenda';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider } from '../providers/service/service';
import { RequestProvider } from '../providers/request/request';
import { TokenProvider } from '../providers/token/token';
import { HeaderProvider } from '../providers/header/header';
import { DateProvider } from '../providers/date/date';
import { CoreProvider } from '../providers/core/core';
import { UserProvider } from '../providers/user/user';
import { ErrorsProvider } from '../providers/errors/errors';
import { SideMenuPage } from '../pages/side-menu/side-menu';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { FoodPlanPage } from '../pages/food-plan/food-plan';
import { FoodPlanContentPage } from '../pages/food-plan-content/food-plan-content';

@NgModule({
  declarations: [
    MyApp,
    AgendaPage,
    ContactPage,
    HomePage,
    TabsPage,
    NavbarComponent,
    DateSelectorComponent,
    SideMenuPage,
    MyProfilePage,
    FoodPlanPage,
    FoodPlanContentPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot( MyApp, {

      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
      monthShortNames: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
      dayShortNames: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],

    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AgendaPage,
    ContactPage,
    HomePage,
    TabsPage,
    SideMenuPage,
    MyProfilePage,
    FoodPlanPage,
    FoodPlanContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceProvider,
    RequestProvider,
    TokenProvider,
    HeaderProvider,
    DateProvider,
    CoreProvider,
    UserProvider,
    ErrorsProvider
  ]
})
export class AppModule {}
