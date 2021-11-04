import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseWiseAttendancePageRoutingModule } from './course-wise-attendance-routing.module';

import { CourseWiseAttendancePage } from './course-wise-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseWiseAttendancePageRoutingModule
  ],
  declarations: [CourseWiseAttendancePage]
})
export class CourseWiseAttendancePageModule {}
