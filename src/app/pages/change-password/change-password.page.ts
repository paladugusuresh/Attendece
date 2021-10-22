import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SharedService, AuthService } from '../../services';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  cpForm: FormGroup;
  errorMsg = '';

  constructor(private sharedService: SharedService, private router: Router,
    private authService: AuthService, private fb: FormBuilder,
    private toastCtrl: ToastController) {

    this.cpForm = this.fb.group({
      oldPassword: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.cpForm.reset();
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
    if (this.cpForm.valid && this.cpForm.controls.password.value === this.cpForm.controls.confirmPassword.value) {
      const user = this.cpForm.value;
      user.userName = this.sharedService.activeProfile.userName;
      this.authService.changePassword(this.sharedService.activeProfile.userId, user.oldPassword, user.password, user.userName)
        .subscribe((res) => {
          if (res.success) {
            toast.color = 'success';
            toast.message = 'Password updated successfully';
            toast.present();
            this.cpForm.reset();
            if (this.sharedService.activeProfile.role === 'Student') {
              this.router.navigate([`/student/dashboard`]);
            }
            else {
              this.router.navigate([`/teacher/home/dashboard`]);
            }
          }
          else {
            this.errorMsg = 'Incorrect old password';
            toast.message = this.errorMsg;
            //toast.present();
          }
        });

    }
    else if (this.cpForm.controls.password.value !== this.cpForm.controls.confirmPassword.value) {
      this.errorMsg = 'Password and Confirm Password doesn\'t match';
      toast.message = this.errorMsg;
      toast.present();
    } else {
      this.errorMsg = 'Please fill all the mandatory(*) fields';
      toast.message = this.errorMsg;
      toast.present();
    }
  }
}
