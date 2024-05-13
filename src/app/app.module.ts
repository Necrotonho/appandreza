import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler,  } from 'ionic-angular';
import { MyApp } from './app.component';

import { DateSelectorComponent } from './../components/date-selector/date-selector';
import { NavbarComponent } from '../components/navbar/navbar'
import { AgendaPage } from '../pages/agenda/agenda';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { HeaderColor  } from '@ionic-native/header-color';
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
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { FoodPlanPage } from '../pages/food-plan/food-plan';
import { SideMenuPage } from '../pages/side-menu/side-menu';
import { FoodPlanContentPage } from '../pages/food-plan-content/food-plan-content';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { PopOverFilterCategoryNewsComponent } from '../components/pop-over-filter-category-news/pop-over-filter-category-news';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MySchedulesPage } from '../pages/my-schedules/my-schedules';
import { PopOverOptPageMySchedulesComponent } from '../components/pop-over-opt-page-my-schedules/pop-over-opt-page-my-schedules';
import { ScheduleProvider } from '../providers/schedule/schedule';
import { MyMeasurementsPage } from '../pages/my-measurements/my-measurements';
import { GetImageProvider } from '../providers/get-image/get-image';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { DatePicker } from '@ionic-native/date-picker';
import { Base64 } from '@ionic-native/base64';
import { Push } from '../../node_modules/@ionic-native/push';
import { FoodPlanProvider } from '../providers/food-plan/food-plan';

@NgModule({
  declarations: [
    MyApp,
    AgendaPage,
    ContactPage,
    HomePage,
    TabsPage,
    NavbarComponent,
    DateSelectorComponent,
    MyProfilePage,
    FoodPlanPage,
    FoodPlanContentPage,
    MySchedulesPage,
    PopOverFilterCategoryNewsComponent,
    PopOverOptPageMySchedulesComponent,
    MyMeasurementsPage,
    SideMenuPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrMaskerModule,
    IonicModule.forRoot( MyApp, {

      statusbarPadding: true,
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
      monthShortNames: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
      dayShortNames: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      platforms: {
        ios: {
          backButtonText: 'Voltar'
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AgendaPage,
    ContactPage,
    HomePage,
    TabsPage,
    MyProfilePage,
    FoodPlanPage,
    FoodPlanContentPage,
    PopOverFilterCategoryNewsComponent,
    PopOverOptPageMySchedulesComponent,
    MySchedulesPage,
    MyMeasurementsPage
  ],
  providers: [
    HeaderColor,
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
    ErrorsProvider,
    ScheduleProvider,
    GetImageProvider,
    Camera,
    Crop,
    Base64,
    DatePicker,
    Push,
    FoodPlanProvider
    
  ]
})
export class AppModule {}
