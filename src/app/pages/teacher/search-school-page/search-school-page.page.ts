import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '../../../models';
import { AppConfig } from '../../../constants';
import { SharedService, SchoolService, StudentService } from '../../../services';

@Component({
  selector: 'app-search-school-page',
  templateUrl: './search-school-page.page.html',
  styleUrls: ['./search-school-page.page.scss'],
})
export class SearchSchoolPagePage implements OnInit {
  schoolForm: FormGroup;
  errorMsg = '';
  segment = '';
  search = '';
  teacherSearchPageTabs = AppConfig.teacherSearchPageTabs;
  schools = [];
  students = [];
  isStudentsDataLoadingCompleted = false;

  constructor(private fb: FormBuilder, private sharedService: SharedService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private schoolService: SchoolService, private studentService: StudentService) {
    // if (this.sharedService.teacherPreferredSchoolId) {
    //   this.router.navigate(['/teacher/home'], { relativeTo: this.activatedRoute });
    // }
    // this.schoolForm = this.fb.group({
    //   schoolId: new FormControl('', Validators.required)
    // });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.segment = param.has('tab') ? param.get('tab') : AppConfig.teacherSearchPageTabs.students;
    });
    this.getStudentsByTeacher(false, '');
    this.getSchoolsMappedToTeacher();
  }

  getSchoolsMappedToTeacher() {
    this.schoolService.getSchoolsMappedToTeacher(this.sharedService.activeProfile.userId)
      .subscribe((response: Response) => {
        if (response.failure) {
          this.schools = [];
        } else {
          this.schools = response.result;
        }
      });
  }

  getStudentsByTeacher(isDataLoadingCompleted: boolean,event: any) {
    this.studentService.getStudentsByTeacherId(this.sharedService.activeProfile.userId)
      .subscribe((res) => {
        if (res.failure) {
          this.students = [];
          console.log(res.error);
        } else {
          this.isStudentsDataLoadingCompleted = isDataLoadingCompleted || false;
          if (this.isStudentsDataLoadingCompleted && event) {
            event.target.complete();
          }
          this.students = this.students.concat(res.result);
        }
      });
  }

  segmentChanged(event: any) {
    this.search = '';
    this.sharedService.teacherSearchPageActiveTab = this.segment;
    this.isStudentsDataLoadingCompleted = false;
  }

  navigateToDashboard(school: any) {
    if (school) {
      this.sharedService.teacherPreferredSchoolId = school.id;
      this.router.navigate(['/teacher/home'], { relativeTo: this.activatedRoute });
    }
  }

  loadData(event) {
    if (this.isStudentsDataLoadingCompleted) {
      event.target.disabled = true;
      return;
    }
    this.getStudentsByTeacher(true, event);
  }

  // validateAndNavigateToDashboard() {
  //   this.errorMsg = '';
  //   if (this.schoolForm.valid) {
  //     this.sharedService.teacherPreferredSchoolId = this.schoolForm.controls.schoolId.value;
  //     this.router.navigate(['/teacher/home'], { relativeTo: this.activatedRoute });
  //   } else {
  //     this.errorMsg = 'Select your school';
  //   }
  // }
}
