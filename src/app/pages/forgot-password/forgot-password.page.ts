import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services';
import { Response } from '../../models';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  fpForm: FormGroup;
  errorMsg = '';

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder,
    private toastCtrl: ToastController) {
      this.fpForm = this.fb.group({
        userName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      });
    }

  ngOnInit() {
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  async updatePassword() {
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
    if (this.fpForm.valid && this.fpForm.controls.password.value === this.fpForm.controls.confirmPassword.value) {
      const user = this.fpForm.value;
      this.authService.forgotPassword(user.oldPassword, user.password, user.userName)
        .subscribe((res: Response) => {
          if (res.success) {
            toast.color = 'success';
            toast.message = 'Password updated successfully';
            toast.present();
            this.router.navigate(['/login']);
          }
          else {
            this.errorMsg = res.error;
            toast.message = this.errorMsg;
            toast.present();
          }
        });

    }
    else if (this.fpForm.controls.password.value !== this.fpForm.controls.confirmPassword.value) {
      this.errorMsg = 'Password and Confirm Password doesn\'t match';
      toast.message = this.errorMsg;
      //toast.present();
    } else {
      this.errorMsg = 'Please fill all the madatory(*) fields';
      toast.message = this.errorMsg;
      //toast.present();
    }
  }
}
