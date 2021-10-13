import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CourseService, AttendanceService, SharedService } from '../../../services';

@Component({
  selector: 'app-course-wise-attendance',
  templateUrl: './course-wise-attendance.page.html',
  styleUrls: ['./course-wise-attendance.page.scss'],
})
export class CourseWiseAttendancePage implements OnInit {
  courses = [];
  attendanceHistory = [];
  courseId = '0';
  constructor(private courseService: CourseService, private attendanceService: AttendanceService, private sharedService: SharedService,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activatedRouter.queryParams.pipe(filter(param => param.courseId)).subscribe((param: Params) => {
      this.courseId = param.courseId ? `${param.courseId}` : '0';
    });
    this.getCoursesByStudentId();
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

  getAttendanceByStudentIdandCourse(event: any) {
    if (this.courseId !== '0') {
      this.attendanceService.getAttendanceByStudentIdandCourseId(this.sharedService.activeProfile.userId, +this.courseId)
        .subscribe((res) => {
          if (res.failure) {
            console.log(res.error);
            this.attendanceHistory = [];
          } else {
            this.attendanceHistory = res.result.history;
          }
        });
    } else {
      this.attendanceHistory = [];
    }
  }

}
