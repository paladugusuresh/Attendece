import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController, LoadingController  } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';
import { AppConfig } from './constants';
import { SharedService, AuthService } from './services';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  profile = null;
  loading = false;
  loadingCtrl: HTMLIonLoadingElement;
  public appPages = [];
  private userLoggedInSubscription: Subscription;

  constructor(public sharedService: SharedService, private authService: AuthService,
    private router: Router, private platform: Platform,
    private alertController: AlertController, private loadingController: LoadingController) { }

  ngOnInit(): void {
    this.populateLoader().then(() => {});
    this.sharedService.loadAppData().subscribe((response) => {
      this.authService.updateAuthData(response.sessionData, response.token);
      this.userLoggedInSubscription = this.authService.userLoggedIn.subscribe((res) => {
        if (res) {
          this.appPages = this.sharedService.activeAppPages;
          this.profile = this.sharedService.getProfile();
        }
      });
      this.sharedService.loadingObserver.pipe(delay(0)).subscribe((loading) => {
        this.toggleLoader(loading).then(() => {});
      });
      this.profile = this.sharedService.getProfile();
      if (this.profile) {
        this.sharedService.activeAppPages = this.profile.roleName.toLowerCase() === 'student' ?
          AppConfig.sideMenu.student : AppConfig.sideMenu.teacher;
        this.authService.userLoggedIn.next(true);
        if (location.pathname === '/' || location.pathname === '/login') {
          this.navigateToHomePage();
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
    this.initializeApp().then(() => {});
  }

  async initializeApp() {
    this.platform.backButton.subscribeWithPriority(1000, async () => {
      if ((this.router.url !== '/login' && this.router.url.indexOf('dashboard') === -1)) {
        if (!this.authService.getToken() && this.router.url !== '/login') {
          await this.logout();
        } else if (this.authService.getToken() && this.router.url.indexOf('dashboard') === -1) {
          this.navigateToHomePage();
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

  navigateToHomePage() {
    if (this.sharedService.activeProfile.roleName.toLowerCase() === 'student') {
      this.router.navigate(['/student/dashboard']);
    } else {
      this.router.navigate(['/teacher/home/dashboard']);
    }
  }

  ngOnDestroy(): void {
    if (this.userLoggedInSubscription) {
      this.userLoggedInSubscription.unsubscribe();
    }
  }

  async logout() {
    document.getElementById('main-content').className = document.getElementById('main-content').className.replace('menu-content-open', '');
    this.authService.clearToken();
    await this.sharedService.clear();
    this.router.navigate(['/login']);
  }

  async populateLoader() {
    this.loadingCtrl = await this.loadingController.create({
      message: 'Please wait...',
    });
  }

  async toggleLoader(loading: boolean) {
    if (this.loadingCtrl) {
      if (loading) {
        await this.loadingCtrl.present();
      } else {
        await this.loadingCtrl.dismiss();
      }
    }
  }
}
