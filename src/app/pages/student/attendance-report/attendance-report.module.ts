import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';

import { AttendanceReportPageRoutingModule } from './attendance-report-routing.module';

import { AttendanceReportPage } from './attendance-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    ChartsModule,
    AttendanceReportPageRoutingModule
  ],
  declarations: [AttendanceReportPage]
})
export class AttendanceReportPageModule {}
