import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
      lastName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
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
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      user.role = 'teacher';
      this.authService.registerUser(user).subscribe((res) => {
        if (res.success) {
          toast.present();
          toast.color = 'success';
          toast.message = 'Registration completed successfully';
          toast.present().then(() => {
            this.router.navigate(['login']);
          });
        } else {
          this.errorMsg = 'Registration not completed';
          toast.message = this.errorMsg;
          toast.present();
        }
      });
    } else {
      this.errorMsg = 'Please fill all the mandatory(*) fields';
      toast.message = this.errorMsg;
      //toast.present();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
