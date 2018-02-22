import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { DateSelectorComponent } from './date-selector/date-selector';
@NgModule({
	declarations: [NavbarComponent,
    DateSelectorComponent],
	imports: [],
	exports: [NavbarComponent,
    DateSelectorComponent]
})
export class ComponentsModule {}
