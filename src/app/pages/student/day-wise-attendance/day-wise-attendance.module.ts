import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DayWiseAttendancePageRoutingModule } from './day-wise-attendance-routing.module';

import { DayWiseAttendancePage } from './day-wise-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DayWiseAttendancePageRoutingModule
  ],
  declarations: [DayWiseAttendancePage]
})
export class DayWiseAttendancePageModule {}
