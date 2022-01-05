import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AttendanceService, CourseService, SharedService } from '../../../services';
import { ToastController } from '@ionic/angular';
import { Response } from '../../../models';
import { AppConfig } from '../../../constants';

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
  academicYears = [];
  attendanceHistory = [];
  profile = null;
  historyDates = [];
  academicId = '';
  segment = 'weekly';
  isPageLoading = true;
  courseId = 0;
  slideOptions = {
    speed: 400,
    spaceBetween: 0,
    autoPlay: false,
  };
  constructor(private attendanceService: AttendanceService, private courseService: CourseService,
    private sharedService: SharedService, private router: Router, private activatedRoute: ActivatedRoute,
    private navController: NavController, private toastCtrl: ToastController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.segment = 'weekly';
    this.academicId = '';
    this.profile = this.sharedService.activeProfile;
    this.getCoursesByStudentId();
    this.getStudentAttendanceDetails();
    this.getAcademicYears();
  }

  getAcademicYears() {
    this.academicYears = [{
      name: '2021 - 2022',
      id: 1
    }, {
      name: '2020 - 2021',
      id: 2
    }, {
      name: '2019 - 2020',
      id: 3
    }, {
      name: '2019 - 2018',
      id: 4
    }];
    this.academicId = this.academicYears[0].id + '';
  }

  getStudentAttendanceDetails() {
    this.attendanceService.getStudentAttendanceDetails(this.sharedService.activeProfile.userId).subscribe((res) => {
      if (res.failure) {
        console.log(res.error);
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

  getCoursesByStudentId() {
    this.courseService.getCoursesByStudentId(this.sharedService.activeProfile.userId, this.sharedService.activeProfile.schoolId)
      .subscribe((res) => {
        if (res.failure) {
          this.courses = [];
          console.log(res.error);
        } else {
          this.courses = res.result;
          this.courseId = this.courses.length > 0 ? this.courses[0].courseId : this.courseId;
          this.getAttendanceByStudentIdandCourse(null);
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

  navigateToCourseWiseAttendance(courseId: number) {
    // this.router.navigate(['/student/attendance/course-wise-attendance'], {
    //   queryParams: { courseId },
    //   relativeTo: this.activatedRoute
    // });
    if (this.isPageLoading) {return;}
    this.courseId = courseId;
    this.getAttendanceByStudentIdandCourse(null);
  }

  getAttendanceByStudentIdandCourse(event: any) {
    this.isPageLoading = true;
    if (this.courseId === 0) { return false; }
    const { startDate, endDate } = this.populateStartEndDate(this.segment);
    this.attendanceService.getAttendanceByStudentCourseandDate(this.sharedService.activeProfile.userId, this.sharedService.activeProfile.schoolId, +this.courseId, startDate, endDate, 1, AppConfig.pageSize)
      .subscribe((res) => {
        if (res.failure) {
          this.attendanceHistory = [];
        } else {
          this.attendanceHistory = res.result.history;
        }
      });
  }

  onAcademicYearChange(ev: any) {
    this.getCoursesByStudentId();
    this.getStudentAttendanceDetails();
  }

  navigateToReport(event) {
    //if (!this.isPageLoading) {
    this.router.navigate(['/student/attendance-report'], { relativeTo: this.activatedRoute });
    //}
  }

  populateStartEndDate(option: string) {
    const academicYear = this.academicYears.find(t => t.id === +this.academicId);
    const accYear = academicYear.name.split('-')[1].trim();
    const currDate = new Date();
    const date = currDate.getFullYear().toString() !== accYear ? new Date(new Date(accYear, 7).setDate(0)) : currDate;
    if (option === 'weekly') {
      const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
      const startDay = `${date.getDate() < 8 ? '01' : date.getDate() - 7 < 10 ? ('0' + (date.getDate() - 7)) : date.getDate()}`;
      const startDate = `${date.getFullYear()}-${month}-${startDay}`;
      const endDay = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
      const endDate = `${date.getFullYear()}-${month}-${endDay}`;
      return {startDate, endDate};
    } else {
      const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
      //const startDate = `${date.getFullYear()}-${month}-01`; need to update after this build just for demo since no data
      const startDay = new Date(new Date().setMonth(-1)).getDate();
      const startDate = `${date.getFullYear()-1}-12-${startDay < 10 ? '0' + startDay : startDay}`;
      const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
      const endDate = `${date.getFullYear()}-${month}-${day}`;
      return {startDate, endDate};
    }
  }

  onCalendarOptionChange(option: string) {
    this.isPageLoading = true;
    this.getAttendanceByStudentIdandCourse(null);
  }

  onFocus() {
    this.isPageLoading = false;
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
    if (!this.isPageLoading && history.isAcknowledged) {
      const updateStudentHistory = {
        courseId: this.courseId,
        studentId: this.sharedService.activeProfile.userId,
        schoolId: this.sharedService.activeProfile.schoolId,
        teacherId: history.teacherId,
        teacherAcknowledged: history.isTeacherAcknowledged ? 'Y' : 'N',
        userAttendanceId: history.attendanceID || 0,
        attendanceDate: history.attendedDate
      };
      this.attendanceService.updateAcknowledement(updateStudentHistory).subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
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
