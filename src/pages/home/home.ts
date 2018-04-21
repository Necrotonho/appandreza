import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { NavController, Platform, PopoverController } from 'ionic-angular';

import { ServiceProvider } from '../../providers/service/service';
import { CoreProvider, postNews } from '../../providers/core/core';
import { UserProvider } from '../../providers/user/user';
import { PopOverFilterCategoryNewsComponent } from '../../components/pop-over-filter-category-news/pop-over-filter-category-news';
import { NavbarComponent } from '../../components/navbar/navbar';
import { MySchedulesPage } from '../my-schedules/my-schedules';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ display: 'block', height: 'auto' })),
      state('hidden', style({ display: 'none', height: 0 })),
      transition('* => *', animate('150ms'))
    ])
  ]
})
export class HomePage {

  private news: postNews[];

  constructor(public navCtrl: NavController, 
              public service: ServiceProvider, 
              private platform: Platform,
              private core: CoreProvider, 
              public popoverCtrl: PopoverController,
              private user: UserProvider) {

    this.core.newObservable.subscribe({

      next: res => {
        
        this.news = res;
      }
    })

    let newsTest: postNews[] = [{

      imgAvatar: 'img/icon.png',
      userName: 'Andreza Matteussi',
      date: '15 de abril, 2018 - 11h atrás',
      img: 'img/granola.jpg',
      content: `<p>Nova receita para você tomar seu café da manhã cada vez mais saudável!!!</p><br/>
      <h1>Granola com iogurte</h1>
      <ul>
        <li>3/4 xícara (100 g) de morango fatiado.</li>
        <li>3/4 xícara (100 g) de mirtilo.</li>
        <li>1/2 banana, cortada em rodelas.</li>
        <li>1 colher (sopa) de germe-de-trigo.</li>
        <li>5 colheres (sopa) de granola.</li>
        <li>175 g de iogurte natural.</li>
      </ul>
      <h2>Modo de preparo</h2><br/>
      <p>No fundo de uma taça grande ou em outro pote de vidro, arrume a metade dos morangos, o mirtilo e a banana. Por cima deles ponha a metade do germe-de-trigo e da granola. Coloque um pouco do iogurte por cima da granola. Novamnete faça uma camada com as frutas, depois ponha o germe-de-trigo e a granola. A última camada deve ser de iogurte. Coma imediatamente ou leve à geladeira até a hora de servir.</p>`,
      categories: ['Receiatas','Novidades']
    },{

      imgAvatar: 'img/icon.png',
      userName: 'Andreza Matteussi',
      date: '15 de abril, 2018 - 11h atrás',
      content: `<p>“Toda vez que você honra sua fome, esse único ato de colocar comida na sua boca é reconstruir a confiança mais uma vez.” – Evelyn Tribole, coach nutricional e especialista em comer intuitivo</p>`,
      categories: [ 'Pensamento do dia' ]
    }];

    this.core.setNews( newsTest );
  } 

  openPageMySchedule(){

    this.navCtrl.push( MySchedulesPage );
  }

  initOberserServer(){

    let observer = {

      next: ( value ) => {


        if( value.request.method == 'updateNews' ){

          this.core.setNews( value.request.data );
        }
      },
      error: ( error ) => console.log( 'error oberserver updateNews: ' + error ),
      complete: () => console.log('observer updateNews completo')
    }

    this.service.observableServerWS.subscribe( observer );
  }



  presentPopover( event ){

    let popover = this.popoverCtrl.create( PopOverFilterCategoryNewsComponent );
    popover.present({
      ev: event
    });
  } 

  filterCategory( post ){

    return post.categories.filter( category => {
      
      return this.core.filterCategory.find( cat => cat.name == category ).selected
    }).length

  }
}
