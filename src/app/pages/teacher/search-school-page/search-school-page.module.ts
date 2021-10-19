import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchSchoolPagePageRoutingModule } from './search-school-page-routing.module';

import { SearchSchoolPagePage } from './search-school-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchSchoolPagePageRoutingModule
  ],
  declarations: [SearchSchoolPagePage]
})
export class SearchSchoolPagePageModule {}
