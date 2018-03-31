import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreProvider } from '../../providers/core/core';

/**
 * Generated class for the FoodPlanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-food-plan',
  templateUrl: 'food-plan.html',
})
export class FoodPlanPage {

  private foodPlan;
  private foddPlanSelected;
  private relationship;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private core: CoreProvider, 
            ){

    this.core.foodPlanObservable.subscribe({

      next: (res) => {
        
        this.foodPlan = res;
        this.segmentChanged( false );
      }
    });
    this.core.setFoodPlan(

      [
        {
          title: 'Normal',
          foodPlan: [
            {
              hour: '10h',
              description: 'Desjejum',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '11h',
              description: 'Almoço',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '12h',
              description: 'Café',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '12h',
              description: 'Café',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '12h',
              description: 'Café',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
        ]
        },
        {
          title: 'Treino 1',
          foodPlan: [
            {
              hour: '09h',
              description: 'Pré treino',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '11h',
              description: 'Pós treino',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
        ]
        },
        {
          title: 'Treino 2',
          foodPlan: [
            {
              hour: '09h',
              description: 'Pré treino3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '11h',
              description: 'Pós treino3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
        ]
        },
        {
          title: 'Treino 2s',
          foodPlan: [
            {
              hour: '09h',
              description: 'Pré treino3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '11h',
              description: 'Pós treino3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
            {
              hour: '16h',
              description: 'Lanche da tarde3',
              content: {
                imgFood: 'img/food.jpg',
                ingredients: ['item', 'item', 'item', 'item','item'],
                modePrepare: 'modo de preparo vai aqui',
                obs: 'obs vai aqui'
              }
            },
        ]
      },
    ]
    
    );
            
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodPlanPage');
  }


  segmentChanged( event ){

    if( event ){

      this.foddPlanSelected = this.foodPlan.find( res => res.title == event.value ).foodPlan;
    }else{

      this.foddPlanSelected = this.foodPlan[0].foodPlan;
      this.relationship = this.foodPlan[0].title;
    }
  }


}
