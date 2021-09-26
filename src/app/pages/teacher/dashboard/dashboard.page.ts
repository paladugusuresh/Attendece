import { Component, OnInit } from '@angular/core';
import { StudentService, CourseService, SharedService } from '../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses = [];
  students = [];
  profile = null;
  schoolName = '';
  slideOptions = {
    speed: 400,
    spaceBetween: 0,
    autoPlay: false
  };

  constructor(private studentService: StudentService, private courseService: CourseService, private sharedService: SharedService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.profile = this.sharedService.activeProfile;
    this.schoolName = this.profile.school;
    this.getCoursesByTeacher();
    this.getStudentsByTeacher();
  }

  getCoursesByTeacher() {
    this.courseService.getCoursesByTeacherId(this.sharedService.activeProfile.userId)
      .subscribe((res) => {
        if (res.failure) {
          this.courses = [];
          console.log(res.error);
        } else {
          this.courses = res.result;
        }
      });
  }

  getStudentsByTeacher() {
    this.studentService.getStudentsByTeacherId(this.sharedService.activeProfile.userId)
      .subscribe((res) => {
        if (res.failure) {
          this.students = [];
          console.log(res.error);
        } else {
          this.students = res.result;
        }
      });
  }

}
