import { Component, OnInit } from '@angular/core';
import { AttendanceService, CourseService, SharedService } from '../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses = [];
  avgAttendance = 0;
  grade = 0;
  attendanceHistory = [];
  profile = null;
  slideOptions= {
    speed: 400,
    spaceBetween: 0,
    autoPlay: false,
  };
  constructor(private attendanceService: AttendanceService, private courseService: CourseService, private sharedService: SharedService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.profile = this.sharedService.activeProfile;
    this.getCoursesByStudentId();
    this.getLastDayAttendanceByStudentId();
  }

  getCoursesByStudentId() {
    this.courseService.getCoursesByStudentId(this.sharedService.activeProfile.userId)
      .subscribe((res) => {
        if (res.failure) {
          this.courses = [];
          console.log(res.error);
        } else {
          this.courses = res.result;
        }
      });
  }

  getLastDayAttendanceByStudentId() {
    this.attendanceService.getLastDayAttendanceByStudentId(this.sharedService.activeProfile.userId)
      .subscribe((res) => {
        if (res.failure) {
          console.log(res.error);
          this.attendanceHistory = [];
          this.avgAttendance = 0;
          this.grade = 0;
        } else {
          this.attendanceHistory = res.result.history;
          this.grade = res.result.grade;
          this.avgAttendance = res.result.averageAttendance;
        }
      });
  }

}
