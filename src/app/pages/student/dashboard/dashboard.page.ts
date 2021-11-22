import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AttendanceService, CourseService, SharedService } from '../../../services';
import { ToastController } from '@ionic/angular';
import { Response } from '../../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
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
  courseId = '0';
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
    this.getLastDayAttendanceByStudentId();
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
    }];
    this.academicId = this.academicYears[0].id + '';
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
      this.courseId = courseId?.toString();
      this.getAttendanceByStudentIdandCourse(null);
  }

  getAttendanceByStudentIdandCourse(event: any) {
    this.isPageLoading = true;
    if (this.courseId === '0') { return false; }
    this.attendanceService.getAttendanceByStudentIdandCourseId(this.sharedService.activeProfile.userId, +this.courseId)
        .subscribe((res) => {
          if (res.failure) {
            this.attendanceHistory = [];
          } else {
            this.attendanceHistory = res.result.history;
          }
    });
  }

  onAcademicYearChange(ev: any) {}

  navigateToReport() {
    if (!this.isPageLoading) {
      this.router.navigate(['/student/attendance-report'], { relativeTo: this.activatedRoute });
    }
  }

  onCalendarOptionChange(option: string) {
    const date = new Date();
    this.isPageLoading = true;
    if (option === 'weekly') {
      this.getLastDayAttendanceByStudentId();
    } else {
      this.getLastDayAttendanceByStudentId();
    }
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
      this.attendanceService.updateAcknowledement(history).subscribe((res: Response) => {
        if (res.failure) {
          console.log(res.error);
        } else {
          toast.color = 'success';
          toast.message = res.result;
          toast.present();
          this.getAttendanceByStudentIdandCourse(null);
        }
      });
    }
  }

}
