import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseWiseAttendancePage } from './course-wise-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: CourseWiseAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseWiseAttendancePageRoutingModule {}
