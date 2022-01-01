import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Response } from '../../../models';
import { CourseService, AttendanceService, SharedService } from '../../../services';
import { ToastController } from '@ionic/angular';
import { AppConfig } from '../../../constants';

@Component({
  selector: 'app-course-wise-attendance',
  templateUrl: './course-wise-attendance.page.html',
  styleUrls: ['./course-wise-attendance.page.scss'],
})
export class CourseWiseAttendancePage implements OnInit {
  courses = [];
  attendanceHistory = [];
  courseId = '0';
  isDataLoading = true;
  currentDate = null;
  startDate = null;
  schoolId: string;
  constructor(private courseService: CourseService, private attendanceService: AttendanceService, private sharedService: SharedService,
    private activatedRouter: ActivatedRoute, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const date = new Date();
    const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
    const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
    this.currentDate = `${date.getFullYear()}-${month}-${day}`;
    this.activatedRouter.queryParams.pipe(filter(param => param.courseId)).subscribe((param: Params) => {
      this.courseId = param.courseId ? `${param.courseId}` : '0';
    });
    const startDateMonth = `${date.getMonth()-2 < 10 ? ('0' + (date.getMonth() - 2)) : date.getMonth() - 2}`;
    this.startDate = `${date.getFullYear()}-${startDateMonth}-01`;
    this.schoolId = `${this.sharedService.teacherPreferredSchoolId || 0}`;
    this.getCoursesByTeacherId();
  }

  getCoursesByTeacherId() {
    this.courseService.getCoursesByTeacherId(this.sharedService.activeProfile.userId, +this.schoolId)
      .subscribe((res) => {
        if (res.failure) {
          this.courses = [];
          console.log(res.error);
        } else {
          this.courses = res.result;
        }
      });
  }

  getStudentsAttendanceByCourseandDate(event: any) {
    this.isDataLoading = true;
    if (this.courseId !== '0') {
      this.attendanceService
      .getStudentsAttendanceByCourseandDate(
        this.sharedService.activeProfile.userId,
        +this.schoolId,
        +this.courseId,
        this.startDate,
        this.currentDate, 1, AppConfig.pageSize)
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
          this.getStudentsAttendanceByCourseandDate(null);
        }
      });
    }
  }

}
