import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
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
  totalDays = 0;
  daysPresent = 0;
  daysAbsent = 0;
  academicYears = [];
  attendanceHistory = [];
  profile = null;
  historyDates = [];
  slideOptions = {
    speed: 400,
    spaceBetween: 0,
    autoPlay: false,
  };
  constructor(private attendanceService: AttendanceService, private courseService: CourseService,
    private sharedService: SharedService, private router: Router, private activatedRoute: ActivatedRoute,
    private navController: NavController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.profile = this.sharedService.activeProfile;
    this.getCoursesByStudentId();
    this.getLastDayAttendanceByStudentId();
    this.getAcademicYears();
  }

  getAcademicYears() {
    this.academicYears = [{
      name: 'Sep\'21-Jun\'22',
      id: 1
    }, {
      name: 'Sep\'20-June\'21',
      id: 2
    }, {
      name: 'Sep\'19-June\'20',
      id: 3
    }];
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
          this.populateAttendaceHistory();
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
    this.router.navigate(['/student/attendance/course-wise-attendance'], {
      queryParams: { courseId },
      relativeTo: this.activatedRoute
    });
  }

  onAcademicYearChange(ev: any) {}

  navigateToReport() {
    this.router.navigate(['/student/attendance-report'], { relativeTo: this.activatedRoute });
  }

}
