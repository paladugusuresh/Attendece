import { Component, OnInit } from '@angular/core';
import { Response } from '../../../models';
import { AttendanceService, SharedService, CourseService } from '../../../services';
import { ToastController } from '@ionic/angular';

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
  maxDate = '';
  isDataLoading = true;
  displayNoData = false;
  constructor(private attendanceService: AttendanceService, private sharedService: SharedService,
    private courseService: CourseService, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const date = new Date();
    const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
    const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
    this.maxDate = `${date.getFullYear()}-${month}-${day}`;
  }

  getAttendanceByStudentCourseandDate(courseId: number) {
    this.courseId = courseId;
    this.isDataLoading = true;
    this.attendanceService
      .getAttendanceByStudentCourseandDate(
        this.sharedService.activeProfile.userId,
        1401,
        courseId,
        this.attendedDate.substr(0, this.attendedDate.indexOf('T')),
        this.attendedDate.substr(0, this.attendedDate.indexOf('T')),
        1, 50)
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

  getCoursesByStudentIdandDate() {
    this.displayNoData = false;
    this.courseService.getCourseByStudentIdandDate(
      this.sharedService.activeProfile.userId,
      this.attendedDate.substr(0, this.attendedDate.indexOf('T')))
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
    this.getCoursesByStudentIdandDate();
  }

  onFocus() {
    this.isDataLoading = false;
  }

  async updateAcknowledgement(history: any) {
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
    if (!this.isDataLoading && history.isAcknowledged) {
      this.attendanceService.updateAcknowledement(history).subscribe((res: Response) => {
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
