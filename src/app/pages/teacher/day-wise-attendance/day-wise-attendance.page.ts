import { Component, OnInit } from '@angular/core';
import { Response } from '../../../models';
import { AttendanceService, SharedService, CourseService } from '../../../services';
import { ToastController } from '@ionic/angular';
import { AppConfig } from '../../../constants';

@Component({
  selector: 'app-day-wise-attendance',
  templateUrl: './day-wise-attendance.page.html',
  styleUrls: ['./day-wise-attendance.page.scss'],
})
export class DayWiseAttendancePage implements OnInit {
  attendanceHistory = [];
  courses = [];
  courseId = 0;
  attendedDate = null;
  startDate = null;
  maxDate = '';
  isDataLoading = true;
  displayNoData = false;
  schoolId: string;
  constructor(private attendanceService: AttendanceService, private sharedService: SharedService,
    private courseService: CourseService, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const date = new Date();
    const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
    const day = `${date.getDate() - 1 < 10 ? ('0' + (date.getDate() - 1)) : date.getDate() - 1}`;
    this.maxDate = `${date.getFullYear()}-${month}-${day}`;
    const startDateMonth = `${date.getMonth()-2 < 10 ? ('0' + (date.getMonth() - 2)): date.getMonth() - 2}`;
    this.startDate = `${date.getFullYear()}-${startDateMonth}-01`;
    this.schoolId = `${this.sharedService.teacherPreferredSchoolId || 0}`;
  }

  getAttendanceByStudentCourseandDate(courseId: number) {
    this.courseId = courseId;
    this.isDataLoading = true;
    this.attendanceService
      .getStudentsAttendanceByCourseandDate(
        this.sharedService.activeProfile.userId,
        +this.schoolId,
        courseId,
        this.attendedDate.substr(0, this.attendedDate.indexOf('T')),
        this.attendedDate.substr(0, this.attendedDate.indexOf('T')),
        1, AppConfig.pageSize)
      .subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
          this.displayNoData = true;
          this.attendanceHistory = [];
        } else {
          this.displayNoData = false;
          this.attendanceHistory = res.result.history;
        }
      });
  }

  getCoursesByTeacherandDate() {
    this.displayNoData = false;
    this.courseService.getCoursesByTeacherId(
      this.sharedService.activeProfile.userId,
      +this.schoolId)
      .subscribe((res: Response) => {
        if (res.failure) {
          this.courses = [];
        } else {
          this.courses = res.result;
        }
      });
  }

  onDateChange() {
    this.getAttendanceByStudentCourseandDate(0);
    this.getCoursesByTeacherandDate();
  }

  onFocus() {
    this.isDataLoading = false;
  }

  async updateStudentAttendanceByTeacher(history: any) {
    const toast = await this.toastCtrl.create({
      message: '',
      duration: 3000,
      position: 'top',
      color: 'danger',
      cssClass: 'custom-toast',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          text: '',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    if (!this.isDataLoading && history.isTeacherAcknowledged) {
      this.attendanceService.updateStudentAttendanceByTeacher(history).subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
        } else {
          toast.color = 'success';
          toast.message = res.result;
          toast.present();
          this.getAttendanceByStudentCourseandDate(this.courseId);
        }
      });
    }
  }

}
