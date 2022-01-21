import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform, ToastController } from '@ionic/angular';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  activeProfile: any;
  activeAppPages = [];
  studentTask: any;
  isTaskUpdated = false;
  preferredSchoolId = 0;
  teacherAppSearchPageActiveTab = '';
  loadingObserver: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loadingRequestMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(private toastCtrl: ToastController, private locationAccuracy: LocationAccuracy, private platform: Platform) { }

  /**
   * Loads the data from storage for first time when user opens the app.
   *
   * @returns The response contains sessionData and token.
   */
  loadAppData(): Observable<{ sessionData: string; token: string }> {
    const observerable = new Observable<{ sessionData: string; token: string }>((observer) => {
      Storage.get({ key: 'sessionData' }).then((val) => {
        this.activeProfile = val.value ? JSON.parse(val.value) : null;
        Storage.get({ key: 'teacherPreferredSchoolId' }).then((preferredSchool) => {
          this.preferredSchoolId = preferredSchool && preferredSchool.value ? +(preferredSchool.value) : 0;
          Storage.get({ key: 'teacherSearchPageActiveTab' }).then((teacherSearchPageActiveTab) => {
            this.teacherAppSearchPageActiveTab = teacherSearchPageActiveTab.value || '';
            Storage.get({ key: 'token' }).then((tokenResult) => {
              observer.next({ sessionData: val.value, token: tokenResult.value });
            });
          });
        });
      });
    });
    return observerable;
  }

  /**
   * Handles the spinner based on the flag during the http requests.
   *
   * @param loading The flag used to control the spinner on http requests.
   * @param url api url.
   */
  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided');
    }
    if (loading) {
      this.loadingRequestMap.set(url, loading);
      this.loadingObserver.next(true);
    } else if (loading === false && this.loadingRequestMap.has(url)) {
      this.loadingRequestMap.delete(url);
    }
    if (this.loadingRequestMap.size === 0) {
      this.loadingObserver.next(false);
    }
  }

  /**
   * Gets the profile data of active session user.
   *
   * @returns The active profile data.
   */
  getProfile(): any {
    if (this.activeProfile) {
      return this.activeProfile;
    } else { return null; }
  }

  /**
   * Sets the profile data of user on updating the profile.
   *
   * @param val The profile data of user.
   */
  setProfile(val: any) {
    this.activeProfile = val;
    Storage.set({ key: 'sessionData', value: JSON.stringify(val) }).then(() => { });
  }

  /**
   * Gets the teacher preffered school id.
   */
  get teacherPreferredSchoolId(): number {
    return this.preferredSchoolId;
  }

  /**
   * Sets the teacher preferred school id.
   */
  set teacherPreferredSchoolId(id: number) {
    this.preferredSchoolId = id;
    Storage.set({ key: 'teacherPreferredSchoolId', value: `${id}` }).then(() => { });
  }

  /**
   * Gets the teacher search page active tab.
   */
  get teacherSearchPageActiveTab() {
    return this.teacherAppSearchPageActiveTab;
  }

  /**
   * Sets the teacher search page active tab.
   */
  set teacherSearchPageActiveTab(activeTab: string) {
    this.teacherAppSearchPageActiveTab = activeTab;
    Storage.set({ key: 'teacherSearchPageActiveTab', value: activeTab }).then(() => { });
  }

  /**
   * Display the message on toast control.
   *
   * @param msg The message to display
   */
  displayToastMessage(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      color: 'danger',
      cssClass: 'custom-toast',
    }).then((toastData) => {
      toastData.present();
    });
  }

  /**
   * Gets the current date in 'YYYY-MM-dd' format.
   */
  get currentDate(): string {
    const date = new Date();
    const month = `${date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}`;
    const day = `${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`;
    const currDate = `${date.getFullYear()}-${month}-${day}`;
    return currDate;
  }

  /**
   * Clears the session details from storage.
   */
  async clear() {
    this.activeAppPages = [];
    await Storage.clear();
    this.activeProfile = null;
  }

  /**
   * Checks the gps of device is enabled or not and ask for permission to enable it if gps is not enabled.
   *
   * @returns boolean value indicates gps is enabled or not.
   */
  async checkAndRequestToEnableGPS() {
    let canRequest = false;
    if (!this.platform.is('android')) {
      return true;
    }
    try {
      canRequest = !!await this.locationAccuracy.canRequest();
      const res = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      if (canRequest === false && res.message) {
        canRequest = (res.code === this.locationAccuracy.SUCCESS_SETTINGS_SATISFIED
          || res.code === this.locationAccuracy.SUCCESS_USER_AGREED);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    return canRequest;
  }
}
