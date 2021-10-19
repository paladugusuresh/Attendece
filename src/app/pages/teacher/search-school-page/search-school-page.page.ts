import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '../../../models';
import { SharedService, SchoolService } from '../../../services';

@Component({
  selector: 'app-search-school-page',
  templateUrl: './search-school-page.page.html',
  styleUrls: ['./search-school-page.page.scss'],
})
export class SearchSchoolPagePage implements OnInit {
  schoolForm: FormGroup;
  errorMsg = '';
  schools = [];

  constructor(private fb: FormBuilder, private sharedService: SharedService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private schoolService: SchoolService) {
    if (this.sharedService.teacherPreferredSchoolId) {
      this.router.navigate(['/teacher/home'], { relativeTo: this.activatedRoute });
    }
    this.schoolForm = this.fb.group({
      schoolId: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
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

  validateAndNavigateToDashboard() {
    this.errorMsg = '';
    if (this.schoolForm.valid) {
      this.sharedService.teacherPreferredSchoolId = this.schoolForm.controls.schoolId.value;
      this.router.navigate(['/teacher/home'], { relativeTo: this.activatedRoute });
    } else {
      this.errorMsg = 'Select your school';
    }
  }

}
