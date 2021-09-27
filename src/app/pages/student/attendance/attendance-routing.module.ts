import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendancePage } from './attendance.page';

const routes: Routes = [
  {
    path: '',
    component: AttendancePage,
    children: [
      {
        path: 'day-wise-attendance',
        loadChildren: () => import('../day-wise-attendance/day-wise-attendance.module').then(m => m.DayWiseAttendancePageModule)
      },
      {
        path: 'course-wise-attendance',
        loadChildren: () => import('../course-wise-attendance/course-wise-attendance.module').then(m => m.CourseWiseAttendancePageModule)
      },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: '/student/attendance/day-wise-attendance'
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendancePageRoutingModule { }
