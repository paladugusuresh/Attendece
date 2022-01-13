import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { SharedService, AuthService } from '../../services';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  role = null;
  profilePic = null;
  errorMsg = '';
  gender: any;
  showDOB: boolean;
  constructor(private sharedService: SharedService, private router: Router,
    private authService: AuthService, private fb: FormBuilder,
    private toastCtrl: ToastController, private actionSheetController: ActionSheetController) {
    this.role = this.sharedService.activeProfile.roleName.toLowerCase();
    this.profilePic = this.sharedService.activeProfile.profilePic;
    this.profileForm = this.fb.group({
      userId: new FormControl(''),
      userName: new FormControl('', Validators.required),
      firstName: new FormControl({ value: '', disabled: true }, Validators.required),
      lastName: new FormControl({ value: '', disabled: true }, Validators.required),
      dob: new FormControl(''),
      email: new FormControl({ value: '', disabled: true }, [Validators.required,
      Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)]),
      contactSettings: new FormControl('internalMessaging')
    });
  }

  ngOnInit() {
    const profile = this.sharedService.getProfile();
    this.profileForm.patchValue(profile);
  }

  async addUpdateProfilePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
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
    if (image && image.base64String) {
      const profile = this.sharedService.getProfile();
      const fileName = profile.profilePic
        ? profile.profilePic.substring(profile.profilePic.lastIndexOf('/') + 1)
        : `${new Date().getTime()}_${profile.userId}.jpg`;
      this.profilePic = `data:image/jpeg;base64,${image.base64String}`;
      const blob = this.blobImageFromBase64String(image.base64String);
      const formData = new FormData();
      formData.append('file', blob);
      this.authService.updateProfilePic(formData, profile.userId).subscribe((res: any) => {
        if (res.failure) {
          toast.message = 'Unable to update the profile pic. Try again';
          toast.present();
          this.profilePic = profile.profilePic;
        } else {
          this.profilePic = `${environment.profilePicPrefix}${res.result}`;
          profile.profilePic = this.profilePic;
          this.sharedService.setProfile(profile);
          toast.message = 'Your profile pic updated successfully';
          toast.color = 'success';
          toast.present();
        }
      });
    }
  }

  blobImageFromBase64String(base64String: any) {
    const byteArray = Uint8Array.from(
      atob(base64String)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    return new Blob([byteArray], { type: 'image/jpg' });
  };

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
      const user = this.profileForm.getRawValue();
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
          profile.dob = user.dob;
          profile.email = user.email;
          profile.contactSettings = user.contactSettings;
          this.sharedService.setProfile(profile);
        } else {
          this.errorMsg = 'Unable to update profile';
          toast.message = this.errorMsg;
          //toast.present();
        }
      });
    }
    else {
      this.errorMsg = 'Please fill all the mandatory(*) fields';
      toast.message = this.errorMsg;
      //toast.present();
    }
  }

}
