/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { Color, Label } from 'ng2-charts';
import { AppConfig } from '../../../constants';
import { Response } from '../../../models';
import { AttendanceService, SharedService, CourseService, StudentService, HolidayService } from '../../../services';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.page.html',
  styleUrls: ['./attendance-report.page.scss'],
})
export class AttendanceReportPage implements OnInit {
  courses = [];
  academicYears = [];
  holidayList = [];
  academicId = 0;
  totalDays = 0;
  daysPresent = 0;
  daysAbsent = 0;
  attendancePercent = 0;
  attendanceHistory = [];
  calendarDate = '';
  calenderDateType: 'string';
  calendarOptions: CalendarComponentOptions = {
    pickMode: 'single'
  };
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
  public lineChartPlugins = [];

  constructor(private attendanceService: AttendanceService, private courseService: CourseService,
    private sharedService: SharedService, private studentService: StudentService,
    private holidayService: HolidayService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //this.getAttendanceReportData();
    this.getAcademicYearsBySchoolId();
  }

  getAcademicYearsBySchoolId() {
    this.studentService.getAcademicYearsBySchoolId(+this.sharedService.activeProfile.schoolId)
      .subscribe((res: Response) => {
        if (res.failure) {
          this.academicYears = [];
        } else {
          this.academicYears = res.result || [
            { schoolYear: '2021 - 2022 chamber', id: 490, startDate: '2021-08-01', endDate: '2022-07-31' }];
          if (this.academicYears.length > 0) {
            this.academicId = this.academicYears[0].id;
            this.onAcademicYearChange(null);
          }
        }
      });
  }

  onAcademicYearChange(event: any) {
    if (this.academicId > 0) {
      const academicYear = this.academicYears.find(t => t.id === +this.academicId);
      const startDate: string = academicYear.startDate;
      const endDay = new Date(new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).setDate(0));
      // eslint-disable-next-line max-len
      const endDate = `${endDay.getFullYear()}-${endDay.getMonth() + 1 < 10 ? '0' + (endDay.getMonth() + 1) : endDay.getMonth() + 1}-${endDay.getDate() < 10 ? '0' + endDay.getDate() : endDay.getDate()}`;
      this.getStudentAttendance(startDate, endDate, academicYear);
    }
  }

  onDateChange(event: any) {
    if (this.academicId > 0) {
      const academicYear = this.academicYears.find(t => t.id === +this.academicId);
      const academicStartDate = new Date(academicYear.startDate);
      const academicEndDate = new Date(academicYear.endDate);
      if (academicStartDate.getFullYear() === event.newMonth.years || academicEndDate.getFullYear() === event.newMonth.years) {
        const startDate = (event.newMonth.months === academicStartDate.getMonth() + 1)
          && academicStartDate.getFullYear() === event.newMonth.years
          ? academicYear.startDate
          : event.newMonth.string;
        const endDay = (event.newMonth.months === academicEndDate.getMonth() + 1) && academicEndDate.getFullYear() === event.newMonth.years
          ? academicEndDate
          : new Date(new Date(new Date(startDate).setMonth(event.newMonth.months)).setDate(0));
        // eslint-disable-next-line max-len
        const endDate = `${endDay.getFullYear()}-${endDay.getMonth() + 1 < 10 ? '0' + (endDay.getMonth() + 1) : endDay.getMonth() + 1}-${endDay.getDate() < 10 ? '0' + endDay.getDate() : endDay.getDate()}`;
        this.getStudentAttendance(startDate, endDate, academicYear);
      }
    }
  }

  getHolidaysBySchoolId() {
    this.holidayService.getHolidaysBySchoolId(+this.sharedService.activeProfile.schoolId)
      .subscribe((res: Response) => {
        if (res.failure) {
          this.holidayList = [];
        } else {
          this.holidayList = res.result;
        }
      });
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

  private getStudentAttendance(startDate: string, endDate: string, academicYear: any) {
    this.attendanceService.getAttendanceByStudentCourseandDate(
      this.sharedService.activeProfile.userId,
      this.sharedService.activeProfile.schoolId,
      0,
      startDate,
      endDate,
      1,
      AppConfig.pageSize)
      .subscribe((res) => {
        if (res.failure) {
          this.attendanceHistory = [];
          this.totalDays = 0;
          this.daysPresent = 0;
          this.daysAbsent = 0;
          this.attendancePercent = 0;
        } else {
          this.attendanceHistory = res.result.history;
          this.totalDays = res.result.totalNumberOfDays || 0;
          this.daysPresent = res.result.daysAttended || 0;
          this.daysAbsent = res.result.daysAttendedWithUnexcusedAbsence || 0;
          this.attendancePercent = res.result.percentOfDaysAttended || 0;
          let attendance: DayConfig[] = [];
          if (this.attendanceHistory.length > 0) {
            attendance = this.attendanceHistory.map((value: any) => {
              if (value.holiday) {
                return { date: value.attendanceDate ? new Date(value.attendanceDate) : null, cssClass: 'disable-date', disable: true };
              } else if (value.attended) {
                return { date: value.attendanceDate ? new Date(value.attendanceDate) : null, cssClass: 'attended-date' };
              } else if (value.attended === false) {
                return { date: value.attendanceDate ? new Date(value.attendanceDate) : null, cssClass: '' };
              }
            });
          } else {
            const date = new Date(endDate);
            for (let day = 1; day <= date.getDate(); day++) {
              attendance.push({date: new Date(date.getFullYear(), date.getMonth(), day), cssClass: '' });
            }
          }
          console.log(attendance);
          const options: CalendarComponentOptions = {
            from: new Date(academicYear.startDate),
            to: new Date(academicYear.endDate),
            pickMode: 'single',
            weekStart: 0,
            daysConfig: attendance,
            disableWeeks: [0, 6],
            showAdjacentMonthDay: false,
            showMonthPicker: false
          };
          this.calendarDate = startDate;
          this.calendarOptions = options;
        }
      });
  }

}
