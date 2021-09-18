import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(public sharedService: SharedService, private authService: AuthService, private router: Router) { }

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
  }

  ngOnDestroy(): void {
    if (this.userLoggedInSubscription) {
      this.userLoggedInSubscription.unsubscribe();
    }
  }

  logout() {
    localStorage.clear();
    this.sharedService.clear();
    this.router.navigate(['/login']);
  }
}
