import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfig } from '../../constants';
import { AuthService, SharedService } from '../../services';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loginErrMsg = '';
  moduleId: any;

  constructor(private router: Router, private fb: FormBuilder,
    private authService: AuthService, private sharedService: SharedService) {
    this.loginForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    localStorage.clear();
    this.sharedService.clear();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loginForm.reset();
  }

  login() {
    this.loginErrMsg = '';
    if (this.loginForm.valid) {
      const userName = this.loginForm.controls.userName.value;
      const password = this.loginForm.controls.password.value;
      this.authService.login(userName, password).subscribe((res) => {
        if (res.success) {
          this.sharedService.activeProfile = res.result;
          this.authService.setToken(res.result.token);
          if (res.result.role === 'Student') {
            this.sharedService.activeAppPages = AppConfig.sideMenu.student;
            this.authService.userLoggedIn.next(true);
            this.router.navigate([`/student/dashboard`]);
          }
          else {
            this.sharedService.activeAppPages = AppConfig.sideMenu.teacher;
            this.authService.userLoggedIn.next(true);
            this.router.navigate([`/teacher/home/search-school-page`], { queryParams: { tab: AppConfig.teacherSearchPageTabs.schools }});
          }
        } else {
          this.loginErrMsg = 'Invalid Credentials';
        }
      });
    } else {
      this.loginErrMsg = 'Enter User Name and Password';
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  navigateToForgetPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
