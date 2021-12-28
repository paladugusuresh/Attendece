import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '../../../models';
import { CourseService, SharedService, SchoolService, AttendanceService } from '../../../services';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './teacher-dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses = [];
  students = [];
  profile = null;
  schoolId = '';
  schoolName = '';
  schools = [];
  maxDate = '';
  courseId = 0;
  attendedDate = null;
  attendanceHistory = [];
  isDataLoading = true;
  displayNoData = false;
  isAttendanceDataLoadingCompleted = false;
  loadingEvent: any;
  totalPages = 0;
  displayPrevIcon = false;
  displayNextIcon = true;
  currSchoolDisplayingIndex = 0;
  allowSelfMarking = false;

  constructor(private courseService: CourseService,
    private sharedService: SharedService, private router: Router,
    private activatedRoute: ActivatedRoute, private schoolService: SchoolService,
    private attendanceService: AttendanceService, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const date = new Date();
    const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
    const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
    this.attendedDate = this.maxDate = `${date.getFullYear()}-${month}-${day}`;
    this.profile = this.sharedService.activeProfile;
    this.schoolId = `${this.sharedService.teacherPreferredSchoolId}`;
    this.getSchoolsMappedToTeacher();
  }

  getCoursesByTeacher() {
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

  getSchoolsMappedToTeacher() {
    this.schoolService.getSchoolsMappedToTeacher(this.sharedService.activeProfile.userId)
      .subscribe((response) => {
        if (response.failure) {
          this.schools = [];
          this.schoolName = '';
        } else {
          this.schools = response.result;
          this.getCoursesByTeacher();
          if (this.schoolId && this.schoolId !== '0') {
            this.schoolName = (this.schools.find(t => t.schoolId === +this.schoolId) || {}).name;
            this.updateCourseDisplayIcons();
          } else {
            this.schoolId = `${this.schools.length > 0 ? this.schools[0].schoolId : ''}`;
            this.onSchoolChange(null);
          }
        }
      });
  }

  getAttendanceByStudentCourseandDate(courseId: number) {
    this.courseId = courseId;
    this.isDataLoading = true;
    this.attendanceService
      .getStudentsAttendanceByCourseandDate(
        courseId,
        this.attendedDate.indexOf('T') > -1
          ? this.attendedDate.substr(0, this.attendedDate.indexOf('T'))
          : this.attendedDate)
      .subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
          this.displayNoData = true;
          this.attendanceHistory = [];
        } else {
          this.displayNoData = false;
          this.attendanceHistory = res.result.history;
          this.totalPages = res.result.total;
          this.isAttendanceDataLoadingCompleted = this.attendanceHistory.length === res.result.total;
          if (!this.isAttendanceDataLoadingCompleted && this.loadingEvent) {
            this.loadingEvent.target.disabled = false;
          }
        }
      });
  }

  onSchoolChange(event: any) {
    if (this.schoolId && this.schools.length > 0) {
      this.sharedService.teacherPreferredSchoolId = +this.schoolId;
      this.schoolName = (this.schools.find(t => t.schoolId === +this.schoolId) || {}).name;
      this.isDataLoading = true;
      this.attendedDate = this.maxDate;
      this.updateCourseDisplayIcons();
      if (this.courseId > 0) {
        this.courseId = 0;
        this.isAttendanceDataLoadingCompleted = false;
        this.getAttendanceByStudentCourseandDate(0);
      }
      if (this.loadingEvent) {
        this.loadingEvent.target.disabled = false;
      }
    } else {
      this.schoolName = '';
    }
  }

  onDateChange() {
    this.getAttendanceByStudentCourseandDate(this.courseId);
  }

  onFocus() {
    this.isDataLoading = false;
  }

  loadData(event: any) {
    this.loadingEvent = event;
    if (this.isAttendanceDataLoadingCompleted || this.attendanceHistory.length === this.totalPages) {
      event.target.complete();
      event.target.disabled = true;
      return;
    } else {
      this.getAttendanceByStudentCourseandDate(this.courseId);
    }
  }

  schoolDetailsOnPrevClick() {
    --this.currSchoolDisplayingIndex;
    this.displayNextIcon = true;
    this.schoolId = this.schools[this.currSchoolDisplayingIndex].id + '';
    if (this.currSchoolDisplayingIndex <= 0) {
      this.displayPrevIcon = false;
      return;
    }
    this.displayPrevIcon = true;
  }

  schoolDetailsOnNextClick() {
    this.displayPrevIcon = true;
    ++this.currSchoolDisplayingIndex;
    this.schoolId = this.schools[this.currSchoolDisplayingIndex].id + '';
    if (this.currSchoolDisplayingIndex === (this.schools.length - 1)) {
      this.displayNextIcon = false;
      return;
    }
    this.displayNextIcon = true;
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

  private updateCourseDisplayIcons() {
    this.currSchoolDisplayingIndex = this.schools.findIndex(t => t.schoolId === +this.schoolId);
    if (this.currSchoolDisplayingIndex <= 0) {
      this.displayPrevIcon = false;
    } else {
      this.displayPrevIcon = true;
    }
    if (this.currSchoolDisplayingIndex === (this.schools.length - 1)) {
      this.displayNextIcon = false;
    } else {
      this.displayNextIcon = true;
    }
  }
}
