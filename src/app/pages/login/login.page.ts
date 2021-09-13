import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
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
    private authService: AuthService, private sharedService: SharedService, private nativeStorage: NativeStorage) {
    this.loginForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    // if (this.sharedService.activeModuleId) {
    //   this.moduleId = this.sharedService.activeModuleId.toUpperCase().substring(0, 1) + this.sharedService.activeModuleId.substring(1);
    // }
  }

  ngOnInit() {
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
            this.router.navigate([`/profile`]);
          }
          else {
            this.sharedService.activeAppPages = AppConfig.sideMenu.teacher;
            this.router.navigate([`/profile`]);
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
