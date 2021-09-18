import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SharedService, AuthService } from '../../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  errorMsg = '';
  gender: any;
  showDOB: boolean;
  constructor(private sharedService: SharedService, private router: Router,
    private authService: AuthService, private fb: FormBuilder,
    private toastCtrl: ToastController) {

    this.profileForm = this.fb.group({
      userId: new FormControl(''),
      userName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required,
        Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)]),
      //gender: new FormControl('', Validators.required),
      //mobileNumber: new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]),
    });
  }

  ngOnInit() {
    const profile = this.sharedService.getProfile();
    this.profileForm.patchValue(profile);
  }

  async updateProfile() {
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
    if (this.profileForm.valid) {
      const user = this.profileForm.value;
      user.createdBy = user.userId;
      this.authService.updateProfile(user).subscribe((res) => {
        if (res.success) {
          toast.color = 'success';
          toast.message = 'Profile updated successfully';
          toast.present();
          const profile = this.sharedService.activeProfile;
          profile.firstName = user.firstName;
          profile.middleName = user.middleName;
          profile.lastName = user.lastName;
          profile.fullName = `${user.firstName} ${user.lastName}`;
          // this.sharedService.activeProfile.mobileNumber = user.mobileNumber;
          profile.dob = user.dob;
          profile.email = user.email;
          this.sharedService.setProfile(profile);
          // this.sharedService.activeProfile.gender = user.gender;
        } else {
          this.errorMsg = 'Unable to update profile';
          toast.message = this.errorMsg;
          toast.present();
        }
      });
    }
    else {
      this.errorMsg = 'Please fill all the mandatory(*) fields';
      toast.message = this.errorMsg;
      toast.present();
    }
  }

}
