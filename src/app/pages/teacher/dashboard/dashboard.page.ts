import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Response } from '../../../models';
import { AppConfig } from '../../../constants';
import { CourseService, SharedService, SchoolService, AttendanceService } from '../../../services';
import { ToastController } from '@ionic/angular';

/**
 * Dashboard page of teacher.
 */
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
  startDate = null;
  attendedDate = null;
  attendanceHistory = [];
  isDataLoading = true;
  displayNoData = false;
  isAttendanceDataLoadingCompleted = false;
  loadingEvent: any;
  pageIndex = 1;
  totalPages = 0;
  displayPrevIcon = false;
  displayNextIcon = true;
  currSchoolDisplayingIndex = 0;
  allowSelfMarking = false;
  isCourseChanged = false;

  constructor(private courseService: CourseService,
    private sharedService: SharedService, private router: Router,
    private activatedRoute: ActivatedRoute, private schoolService: SchoolService,
    private attendanceService: AttendanceService, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.courseId = 0;
    const date = new Date();
    const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
    const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
    this.attendedDate = this.maxDate = `${date.getFullYear()}-${month}-${day}`;
    const startDateMonth = `${date.getMonth() - 2 < 10
      ? date.getMonth() - 2 < 0
        ? 12 - (date.getMonth() + 1)
        : ('0' + (date.getMonth() - 2))
      : date.getMonth() - 2}`;
    this.startDate = `${date.getMonth() - 2 < 0 ? date.getFullYear() - 1 : date.getFullYear()}-${startDateMonth}-01`;
    this.profile = this.sharedService.activeProfile;
    this.schoolId = `${this.sharedService.teacherPreferredSchoolId}`;
    this.getSchoolsMappedToTeacher();
  }

  /**
   * Gets the courses mapped to teacher.
   */
  getCoursesByTeacher() {
    this.courseService.getCoursesByTeacherId(this.sharedService.activeProfile.userId, +this.schoolId)
      .subscribe((res) => {
        if (res.failure) {
          this.courses = [];
          console.log(res.error);
        } else {
          this.courses = res.result;
          this.courseId = +this.courseId === 0 && this.courses.length > 0 ? this.courses[0].courseId : this.courseId;
          this.getAttendanceByStudentCourseandDate(this.courseId);
          this.getSelfMarkStatus();
        }
      });
  }

  /**
   * Gets the schools mapped to teacher.
   */
  getSchoolsMappedToTeacher() {
    this.schoolService.getSchoolsMappedToTeacher(this.sharedService.activeProfile.userId)
      .subscribe((response) => {
        if (response.failure) {
          this.schools = [];
          this.schoolName = '';
        } else {
          this.schools = response.result;
          if (this.schoolId && this.schoolId !== '0') {
            this.schoolName = (this.schools.find(t => t.schoolId === +this.schoolId) || {}).name;
            this.updateSchoolDisplayIcons();
          } else {
            this.schoolId = `${this.schools.length > 0 ? this.schools[0].schoolId : ''}`;
            this.onSchoolChange(null);
          }
          this.getCoursesByTeacher();
        }
      });
  }

  /**
   * Gets the self mark status mapped to course.
   */
  getSelfMarkStatus() {
    this.attendanceService.getSelfMarkStatus(+this.sharedService.activeProfile.userId, +this.schoolId, this.courseId)
      .subscribe((res: Response) => {
        if (res.failure) {
          this.allowSelfMarking = false;
        } else {
          this.allowSelfMarking = res.result;
        }
      });
  }

  /**
   * Gets the attendance of students mapped to teacher based on course and date.
   *
   * @param courseId the course id.
   */
  getAttendanceByStudentCourseandDate(courseId: number) {
    this.courseId = courseId;
    this.isDataLoading = true;
    this.attendanceService
      .getStudentsAttendanceByCourseandDate(
        this.sharedService.activeProfile.userId,
        +this.schoolId,
        courseId,
        this.attendedDate.indexOf('T') > -1
          ? this.attendedDate.substr(0, this.attendedDate.indexOf('T'))
          : this.attendedDate,
        this.attendedDate.indexOf('T') > -1
          ? this.attendedDate.substr(0, this.attendedDate.indexOf('T'))
          : this.attendedDate, this.pageIndex, AppConfig.pageSize)
      .subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
          this.displayNoData = true;
          this.attendanceHistory = [];
        } else {
          this.displayNoData = false;
          if (res.error) {
            this.sharedService.displayToastMessage(res.error);
          }
          this.attendanceHistory = this.pageIndex === 1 ? res.result.history : this.attendanceHistory.concat(res.result.history);
          this.totalPages = res.result.total || (res.result.history).length;
          this.isAttendanceDataLoadingCompleted = this.attendanceHistory.length >= res.result.total;
          if (this.loadingEvent) {
            this.loadingEvent.target.complete();
          }
          if (this.isAttendanceDataLoadingCompleted && this.loadingEvent) {
            this.loadingEvent.target.disabled = true;
          }
        }
      });
  }

  /**
   * This event is fired when user changes the school.
   *
   * @param event the change event.
   */
  onSchoolChange(event: any) {
    if (this.schoolId && this.schools.length > 0) {
      this.sharedService.teacherPreferredSchoolId = +this.schoolId;
      this.schoolName = (this.schools.find(t => t.schoolId === +this.schoolId) || {}).name;
      this.isDataLoading = true;
      this.attendedDate = this.maxDate;
      this.updateSchoolDisplayIcons();
      if (this.courseId > 0) {
        this.isAttendanceDataLoadingCompleted = false;
        this.getCoursesByTeacher();
      }
      if (this.loadingEvent) {
        this.loadingEvent.target.disabled = false;
      }
    } else {
      this.schoolName = '';
    }
  }

  /**
   * This event is fired when user changes the date.
   */
  onDateChange() {
    if (this.courseId > 0) {
      this.pageIndex = 1;
      this.isAttendanceDataLoadingCompleted = false;
      this.getAttendanceByStudentCourseandDate(this.courseId);
    }
  }

  /**
   * This event is fired when user changes the course.
   *
   * @param courseId the course id.
   */
  onCourseChange(courseId: number) {
    if (courseId > 0) {
      this.pageIndex = 1;
      this.isAttendanceDataLoadingCompleted = false;
      this.isCourseChanged = true;
      this.getAttendanceByStudentCourseandDate(courseId);
      this.getSelfMarkStatus();
    }
  }

  /**
   * This event is fired when user focus on acknowlegdement checkbox(toggle) control.
   */
  onFocus() {
    this.isDataLoading = false;
  }

  onSelfMarkingControlFocus() {
    this.isCourseChanged = false;
  }

  /**
   * Loads the data of students attendance on scrolling.
   *
   * @param event scrolling event.
   */
  loadData(event: any) {
    this.loadingEvent = event;
    if (this.isAttendanceDataLoadingCompleted || this.attendanceHistory.length === this.totalPages) {
      event.target.complete();
      event.target.disabled = true;
      return;
    } else {
      ++this.pageIndex;
      this.getAttendanceByStudentCourseandDate(this.courseId);
    }
  }

  /**
   * This event is triggered when user selects the previous button of school container.
   */
  schoolDetailsOnPrevClick() {
    --this.currSchoolDisplayingIndex;
    this.displayNextIcon = true;
    this.schoolId = this.schools[this.currSchoolDisplayingIndex].id + '';
    if (this.currSchoolDisplayingIndex <= 0) {
      this.displayPrevIcon = false;
      return;
    }
    this.pageIndex = 1;
    this.isAttendanceDataLoadingCompleted = false;
    this.displayPrevIcon = true;
    this.onSchoolChange(null);
  }

  /**
   * This event is triggered when user selects the next button of school container.
   */
  schoolDetailsOnNextClick() {
    this.displayPrevIcon = true;
    ++this.currSchoolDisplayingIndex;
    this.schoolId = this.schools[this.currSchoolDisplayingIndex].id + '';
    this.pageIndex = 1;
    if (this.currSchoolDisplayingIndex === (this.schools.length - 1)) {
      this.displayNextIcon = false;
      return;
    }
    this.pageIndex = 1;
    this.isAttendanceDataLoadingCompleted = false;
    this.displayNextIcon = true;
    this.onSchoolChange(null);
  }

  /**
   * Enable or disable the self marking by teacher for a course.
   */
  async enableOrDisableSelfMark() {
    if (!this.isCourseChanged) {
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
      this.attendanceService.enableOrDisableSelfMarking(+this.sharedService.activeProfile.userId, this.courseId, this.allowSelfMarking)
      .subscribe((res: Response) => {
        if (res.failure) {
          this.allowSelfMarking = !this.allowSelfMarking;
          toast.message = res.error;
          toast.present();
        } else {
          toast.color = 'success';
          toast.message = res.result;
          toast.present();
        }
      });
    }
  }

  /**
   * Updates the student attendance history (i.e., acknowledgement) by teacher.
   *
   * @param history The student attendance history object.
   */
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
    if (!this.isDataLoading) {
      const updateStudentHistory = {
        courseId: this.courseId,
        teacherId: this.sharedService.activeProfile.userId,
        schoolId: +this.schoolId,
        studentId: history.studentId,
        delete: false,
        teacherAcknowledged: history.isTeacherAcknowledged ? 'Y' : 'N',
        userAttendanceId: history.attendanceID || 0,
        attendanceDate: this.attendedDate.indexOf('T') > -1
          ? this.attendedDate.substr(0, this.attendedDate.indexOf('T'))
          : this.attendedDate,
        teacherLatitude: null,
        teacherLongitude: null
      };
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        if (coordinates && coordinates.coords) {
          updateStudentHistory.teacherLatitude = coordinates.coords.latitude;
          updateStudentHistory.teacherLongitude = coordinates.coords.longitude;
        }
        console.log(coordinates);
      } catch (error) { }
      this.attendanceService.updateStudentAttendanceByTeacher(updateStudentHistory).subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
        } else {
          toast.color = 'success';
          toast.message = res.result;
          toast.present();
          //this.getAttendanceByStudentCourseandDate(this.courseId);
        }
      });
    }
  }

  /**
   * Updates the school displaying icons based on school list.
   */
  private updateSchoolDisplayIcons() {
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
