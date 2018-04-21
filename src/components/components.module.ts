import { NgModule } from '@angular/core';
import { PopOverFilterCategoryNewsComponent } from './pop-over-filter-category-news/pop-over-filter-category-news';
import { PopOverOptPageMySchedulesComponent } from './pop-over-opt-page-my-schedules/pop-over-opt-page-my-schedules';
@NgModule({
	declarations: [PopOverFilterCategoryNewsComponent,
    PopOverOptPageMySchedulesComponent],
	imports: [],
	exports: [PopOverFilterCategoryNewsComponent,
    PopOverOptPageMySchedulesComponent]
})
export class ComponentsModule {}
