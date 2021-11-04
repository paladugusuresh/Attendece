import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController  } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';
import { AppConfig } from './constants';
import { SharedService, AuthService } from './services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  profile = null;
  public appPages = [];
  private userLoggedInSubscription: Subscription;

  constructor(public sharedService: SharedService, private authService: AuthService,
    private router: Router, private platform: Platform,
    private alertController: AlertController) { }

  ngOnInit(): void {
    this.userLoggedInSubscription = this.authService.userLoggedIn.subscribe((res) => {
      if (res) {
        this.appPages = this.sharedService.activeAppPages;
        this.profile = this.sharedService.getProfile();
      }
    });
    this.profile = this.sharedService.getProfile();
    if (this.profile) {
      this.sharedService.activeAppPages = this.profile.role.toLowerCase() === 'teacher' ?
        AppConfig.sideMenu.teacher : AppConfig.sideMenu.student;
      this.authService.userLoggedIn.next(true);
    } else {
      this.router.navigate(['/login']);
    }
    this.initializeApp().then(() => {});
  }

  async initializeApp() {
    this.platform.backButton.subscribeWithPriority(1000, async () => {
      if ((this.router.url !== '/login' && this.router.url.indexOf('dashboard') === -1)) {
        if (!this.authService.getToken() && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        } else if (this.authService.getToken() && this.router.url.indexOf('dashboard') === -1) {
          if (this.sharedService.activeProfile.role === 'Student') {
            this.router.navigate(['/student/dashboard']);
          } else {
            this.router.navigate(['/teacher/home/dashboard']);
          }
        }
      } else {
        const alertCtrl = await this.alertController.create({
          header: 'Alert!!',
          message: 'Are you sure do you want to quit the app?',
          backdropDismiss: false,
          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Clicked cancel button');
            }
          }, {
            text: 'Yes',
            handler: () => {
              if (this.authService.getToken()) {
                this.logout();
              } else {
                App.exitApp();
              }
            }
          }]
        });
        if (this.authService.getToken()) {
          alertCtrl.message = 'Are you sure do you want to logout?';
        }
        alertCtrl.present();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userLoggedInSubscription) {
      this.userLoggedInSubscription.unsubscribe();
    }
  }

  logout() {
    document.getElementById('main-content').className = document.getElementById('main-content').className.replace('menu-content-open', '');
    localStorage.clear();
    this.sharedService.clear();
    this.router.navigate(['/login']);
  }
}
