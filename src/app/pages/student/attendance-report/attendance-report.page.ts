/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Color, Label } from 'ng2-charts';
import { Response } from '../../../models';
import { AttendanceService, SharedService, CourseService } from '../../../services';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.page.html',
  styleUrls: ['./attendance-report.page.scss'],
})
export class AttendanceReportPage implements OnInit {
  courses = [];
  attendanceHistory = [];
  public lineChartData = [{ data: [], label: 'Attendance' }];
  public lineChartLabels: Label[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
  public lineChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private attendanceService: AttendanceService, private courseService: CourseService, private sharedService: SharedService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getAttendanceReportData();
  }

  getAttendanceReportData() {
    this.attendanceService.getAttendanceReportData(this.sharedService.activeProfile.userId).subscribe((res: Response) => {
      if (res.failure) {
        this.lineChartData[0].data = [];
      } else {
        this.lineChartData[0].data = res.result;
      }
    });
  }

  getCourseByStudentandMonth(month: number) {
    this.courseService.getCourseByStudentandMonth(this.sharedService.activeProfile.userId, month)
      .subscribe((res: Response) => {
        if (res.failure) {
          this.courses = [];
        } else {
          this.courses = res.result;
          this.populateCourses();
          this.getAttendanceByStudentIdandCourse(this.courses[0].id);
        }
      });
  }

  getAttendanceByStudentIdandCourse(courseId: number) {
    if (courseId > 0) {
      this.attendanceService.getAttendanceByStudentIdandCourseId(this.sharedService.activeProfile.userId, courseId)
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

  populateCourses() {
    this.courses.forEach((course, index) => {
      if (index === 0) {
        course.isExpandable = true;
      } else {
        course.isExpandable = false;
      }
    });
  }

  chartClicked(event: any) {
    if (event.active.length > 0) {
      const datasetIndex = event.active[0]._datasetIndex;
      const dataIndex = event.active[0]._index;
      this.getCourseByStudentandMonth(dataIndex + 1);
      console.log(this.lineChartData[datasetIndex].data[dataIndex]);
    }
  }

  expandPanel(selectedCourse: any) {
    this.attendanceHistory = [];
    this.courses.forEach((course) => {
      if (course.id === selectedCourse.id) {
        course.isExpandable = true;
      } else {
        course.isExpandable = false;
      }
    });
    this.getAttendanceByStudentIdandCourse(selectedCourse.id);
  }

  collapsePanel(course: any) {
    course.isExpandable = false;
    this.attendanceHistory = [];
  }

}
