import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService, CourseService, SharedService, SchoolService } from '../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses = [];
  students = [];
  profile = null;
  schoolId = '';
  schoolName = '';
  schools = [];
  slideOptions = {
    speed: 400,
    spaceBetween: 0,
    autoPlay: false
  };

  constructor(private studentService: StudentService, private courseService: CourseService,
    private sharedService: SharedService, private router: Router,
    private activatedRoute: ActivatedRoute, private schoolService: SchoolService) {
      if (!this.sharedService.teacherPreferredSchoolId) {
        this.router.navigate(['/teacher/search-school-page'], { relativeTo: this.activatedRoute });
      }
    }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.profile = this.sharedService.activeProfile;
    this.schoolId = `${this.sharedService.teacherPreferredSchoolId}`;
    this.getCoursesByTeacher();
    this.getStudentsByTeacher();
    this.getSchoolsMappedToTeacher();
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

  getSchoolsMappedToTeacher() {
    this.schoolService.getSchoolsMappedToTeacher(this.sharedService.activeProfile.userId)
      .subscribe((response) => {
        if (response.failure) {
          this.schools = [];
          this.schoolName = '';
        } else {
          this.schools = response.result;
          this.schoolName = (this.schools.find(t => t.id === +this.schoolId) || {}).name;
        }
      });
  }

  onSchoolChange(event: any) {
    if (this.schoolId) {
      this.sharedService.teacherPreferredSchoolId = +this.schoolId;
      this.schoolName = (this.schools.find(t => t.id === +this.schoolId) || {}).name;
    } else {
      this.schoolName = '';
    }
  }

}
