import { Component, OnInit } from '@angular/core';
import { Response } from '../../../models';
import { AttendanceService, SharedService } from '../../../services';

@Component({
  selector: 'app-day-wise-attendance',
  templateUrl: './day-wise-attendance.page.html',
  styleUrls: ['./day-wise-attendance.page.scss'],
})
export class DayWiseAttendancePage implements OnInit {
  attendanceHistory = [];
  attendedDate = null;
  constructor(private attendanceService: AttendanceService, private sharedService: SharedService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //this.getAttendanceByStudentIdandDate();
  }

  getAttendanceByStudentIdandDate() {
    this.attendanceService
      .getAttendanceByStudentIdandDate(
        this.sharedService.activeProfile.userId,
        this.attendedDate.substr(0, this.attendedDate.indexOf('T')))
      .subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
          this.attendanceHistory = [];
        } else {
          this.attendanceHistory = res.result.history;
        }
      });
  }

}
