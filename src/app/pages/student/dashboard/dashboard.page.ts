import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { AttendanceService, CourseService, SharedService, StudentService } from '../../../services';
import { ToastController } from '@ionic/angular';
import { Response } from '../../../models';
import { AppConfig } from '../../../constants';

/**
 * Dashboard page of student.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './student-dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class StudentDashboardPage implements OnInit {
  courses = [];
  avgAttendance = 0;
  grade = 0;
  totalDays = 0;
  daysPresent = 0;
  daysAbsent = 0;
  attendanceHistory = [];
  profile = null;
  historyDates = [];
  segment = 'weekly';
  isPageLoading = true;
  courseId = 0;
  selfMarkEnabled = false;
  teacherId = 0;
  displayMultiCourseWarningMsg = false;
  currentDate = this.sharedService.currentDate;
  slideOptions = {
    speed: 400,
    spaceBetween: 0,
    autoPlay: false,
  };
  constructor(private attendanceService: AttendanceService, private courseService: CourseService,
    private sharedService: SharedService, private router: Router, private activatedRoute: ActivatedRoute,
    private navController: NavController, private toastCtrl: ToastController, private studentService: StudentService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.segment = 'weekly';
    this.profile = this.sharedService.activeProfile;
    this.getCoursesByStudentId();
    this.getStudentAttendanceDetails();
    this.getAttendanceByStudentIdandCourse(null);
  }

  /**
   * Gets the student attendance details (need to remove in next version release).
   */
  getStudentAttendanceDetails() {
    this.attendanceService.getStudentAttendanceDetails(this.sharedService.activeProfile.userId).subscribe((res) => {
      if (res.failure) {
        this.attendanceHistory = [];
        this.avgAttendance = 0;
        this.grade = 0;
        this.totalDays = 0;
        this.daysAbsent = this.daysPresent = 0;
      } else {
        this.avgAttendance = res.result.percentOfDaysAttended;
        this.totalDays = res.result.totalNumberOfDays;
        this.daysPresent = res.result.daysAttended;
        this.daysAbsent = res.result.daysAttendedWithUnexcusedAbsence;
      }
    });
  }

  /**
   * Gets the courses based on student id.
   */
  getCoursesByStudentId() {
    this.courseService.getCoursesByStudentId(this.sharedService.activeProfile.userId, this.sharedService.activeProfile.schoolId)
      .subscribe((res) => {
        if (res.failure) {
          this.courses = [];
          console.log(res.error);
        } else {
          this.courses = res.result;
          this.courseId = this.courses.length > 0 ? this.courses[0].courseId : this.courseId;
          //this.getAttendanceByStudentIdandCourse(null);
          const course = this.courses.length > 0 ? this.courses[0].name : '';
          if (course && this.courses.some((t: any) => t.name && t.name !== course)) {
            this.displayMultiCourseWarningMsg = true;
          } else {
            this.displayMultiCourseWarningMsg = false;
          }
        }
      });
  }

  /**
   * Gets current week attendance of student (need to remove in next version release).
   */
  getLastDayAttendanceByStudentId() {
    this.attendanceService.getLastDayAttendanceByStudentId(this.sharedService.activeProfile.userId)
      .subscribe((res) => {
        if (res.failure) {
          console.log(res.error);
          this.attendanceHistory = [];
          this.avgAttendance = 0;
          this.grade = 0;
          this.totalDays = 0;
          this.daysAbsent = this.daysPresent = 0;
        } else {
          this.attendanceHistory = res.result.history;
          this.grade = res.result.grade;
          this.avgAttendance = res.result.averageAttendance;
          this.totalDays = res.result.totalDays;
          this.daysPresent = res.result.daysPresent;
          this.daysAbsent = res.result.daysAbsent;
          //this.populateAttendaceHistory();
        }
      });
  }

  // (need to remove in next version release).
  populateAttendaceHistory() {
    this.attendanceHistory.forEach((history) => {
      const existingHistory = this.historyDates.find(t => t.attendedDate === history.attendedDate);
      if (!existingHistory) {
        this.historyDates.push({ attendedDate: history.attendedDate, historyData: [history] });
      } else {
        existingHistory.historyData.push(history);
      }
    });
  }

  /**
   * This event is fired when user changes the course (need to remove in next version release).
   *
   * @param courseId The course id.
   */
  navigateToCourseWiseAttendance(courseId: number) {
    // this.router.navigate(['/student/attendance/course-wise-attendance'], {
    //   queryParams: { courseId },
    //   relativeTo: this.activatedRoute
    // });
    if (this.isPageLoading) { return; }
    this.courseId = courseId;
    this.getAttendanceByStudentIdandCourse(null);
  }

  /**
   * Gets the student attendance with the selected course.
   *
   * @param event The change event object.
   */
  getAttendanceByStudentIdandCourse(event: any) {
    this.isPageLoading = true;
    const { startDate, endDate } = this.populateStartEndDate(this.segment);
    this.attendanceService.getAttendanceByStudentCourseandDate(
      this.sharedService.activeProfile.userId,
      this.sharedService.activeProfile.schoolId,
      +this.courseId,
      startDate,
      endDate,
      1,
      AppConfig.pageSize)
      .subscribe((res) => {
        if (res.failure) {
          this.attendanceHistory = [];
          this.selfMarkEnabled = false;
          this.teacherId = 0;
        } else {
          this.attendanceHistory = res.result.history;
          this.selfMarkEnabled = res.result.selfMarkEnabled || false;
          this.teacherId = res.result.teacherId || 0;
        }
      });
  }

  /**
   * Navigates to attendance reporting page of student.
   *
   * @param event The click event object.
   */
  navigateToReport(event) {
    this.router.navigate(['/student/attendance-report'], { relativeTo: this.activatedRoute });
  }

  /**
   * Populates the start and end date using current date.
   *
   * @param option The option use to detect weekly or monthly.
   * @returns object contains start date & end date.
   */
  populateStartEndDate(option: string) {
    const date = new Date();
    if (option === 'weekly') {
      const weekStartDate = new Date(new Date().setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? 0 : 1)));
      const month = `${weekStartDate.getMonth() + 1 < 10 ? ('0' + (weekStartDate.getMonth() + 1)) : weekStartDate.getMonth() + 1}`;
      const startDay = `${weekStartDate.getDate() < 10  ? ('0' + weekStartDate.getDate()) : weekStartDate.getDate()}`;
      const startDate = `${weekStartDate.getFullYear()}-${month}-${startDay}`;
      const endDay = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
      const endDate = `${date.getFullYear()}-${month}-${endDay}`;
      return { startDate, endDate };
    } else {
      const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
      const startDate = `${date.getFullYear()}-${month}-01`;
      const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
      const endDate = `${date.getFullYear()}-${month}-${day}`;
      return { startDate, endDate };
    }
  }

  /**
   * This event is fired when user changes the date.
   *
   * @param option The option use to detect weekly or monthly.
   */
  onCalendarOptionChange(option: string) {
    this.isPageLoading = true;
    this.getAttendanceByStudentIdandCourse(null);
  }

  /**
   * This event is fired when user clicks on acknowlegdement checkbox(toggle) control.
   */
  onFocus() {
    this.isPageLoading = false;
  }

  /**
   * Updates the student attendance history (i.e., acknowledgement) by teacher.
   *
   * @param history The student attendance history object.
   */
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
    if (!this.isPageLoading) {
      const updateStudentHistory = {
        courseId: this.courseId,
        studentId: this.sharedService.activeProfile.userId,
        schoolId: this.sharedService.activeProfile.schoolId,
        teacherId: this.teacherId,
        delete: false,
        selfAcknowledged: history.isAcknowledged ? 'Y' : 'N',
        userAttendanceId: history.attendanceID || 0,
        attendanceDate: history.attendanceDate,
        studentLatitude: null,
        studentLongitude: null
      };
      try {
        const canRequest = await this.sharedService.checkAndRequestToEnableGPS();
        if (canRequest) {
          const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy : true, timeout: 10000 });
          if (coordinates && coordinates.coords) {
            updateStudentHistory.studentLatitude = coordinates.coords.latitude;
            updateStudentHistory.studentLongitude = coordinates.coords.longitude;
          }
        }
      } catch (error) { }
      this.attendanceService.updateAcknowledement(updateStudentHistory).subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
          toast.message = 'Unable to mark the attendance. Try again or contact administrator.';
          toast.present();
        } else {
          toast.color = 'success';
          toast.message = res.result;
          toast.present();
          this.onCalendarOptionChange(this.segment);
        }
      });
    }
  }

}
