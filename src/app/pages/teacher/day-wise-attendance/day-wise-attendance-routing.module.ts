import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DayWiseAttendancePage } from './day-wise-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: DayWiseAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayWiseAttendancePageRoutingModule {}
