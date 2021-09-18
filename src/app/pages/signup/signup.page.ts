import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
//import { Role } from 'src/app/models';
import { SharedService, AuthService } from '../../services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  registerForm: FormGroup;
  errorMsg = '';
  lstRoles: Array<any>;
  constructor(private sharedService: SharedService, private router: Router,
    private authService: AuthService, private fb: FormBuilder,
    private toastCtrl: ToastController) {
    this.registerForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      // dob: new FormControl('', Validators.required),
      // gender: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required,
        Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      //roleId: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.authService.getAllRoles().subscribe(res => {
      if (res.success) {
        this.lstRoles = res.result.filter(x => x.roleName.toUpperCase() !== 'CHILD');
      }
    });
  }
  get f() { return this.registerForm.controls; }
  async register() {
    this.errorMsg = '';
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
    if (this.registerForm.valid && this.registerForm.controls.password.value === this.registerForm.controls.confirmPassword.value) {
      const user = this.registerForm.value;
      user.role = 'teacher';
      this.authService.registerUser(user).subscribe((res) => {
        if (res.success) {
          if (res.result === -1) {
            this.errorMsg = 'Mobile No. already registered';
            toast.message = this.errorMsg;
            toast.present();
          }
          if (res.result === -2) {
            this.errorMsg = 'Email already in use';
            toast.message = this.errorMsg;
            toast.present();
          }
          else {
            toast.present();
            toast.color = 'success';
            toast.message = 'Registration completed successfully';
            toast.present().then(() => {
              this.router.navigate(['login']);
            });
          }
        } else {
          this.errorMsg = 'Registration not completed';
          toast.message = this.errorMsg;
          toast.present();
        }
      });
    } else if (this.registerForm.controls.mobileNumber.hasError('pattern')) {
      this.errorMsg = 'Invalid Mobile Number';
      toast.message = this.errorMsg;
      toast.present();
    } else if (this.registerForm.controls.password.value !== this.registerForm.controls.confirmPassword.value) {
      this.errorMsg = 'Password and Confirm Password doesn\'t match';
      toast.message = this.errorMsg;
      toast.present();
    } else {
      this.errorMsg = 'Please fill all the madatory(*) fields';
      toast.message = this.errorMsg;
      toast.present();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
