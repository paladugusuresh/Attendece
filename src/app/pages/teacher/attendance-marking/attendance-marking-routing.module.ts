import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceMarkingPage } from './attendance-marking.page';

const routes: Routes = [
  {
    path: '',
    component: AttendanceMarkingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceMarkingPageRoutingModule {}
