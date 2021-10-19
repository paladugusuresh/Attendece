import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchSchoolPagePage } from './search-school-page.page';

const routes: Routes = [
  {
    path: '',
    component: SearchSchoolPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchSchoolPagePageRoutingModule {}
