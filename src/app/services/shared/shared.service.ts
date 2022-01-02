import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

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

  constructor(private toastCtrl: ToastController) { }

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

  getProfile(): any {
    if (this.activeProfile) {
      return this.activeProfile;
    } else { return null; }
  }

  setProfile(val: any) {
    this.activeProfile = val;
    Storage.set({ key: 'sessionData', value: JSON.stringify(val) }).then(() => { });
  }

  get teacherPreferredSchoolId(): number {
    return this.preferredSchoolId;
  }

  set teacherPreferredSchoolId(id: number) {
    this.preferredSchoolId = id;
    Storage.set({ key: 'teacherPreferredSchoolId', value: `${id}` }).then(() => { });
  }

  get teacherSearchPageActiveTab() {
    return this.teacherAppSearchPageActiveTab;
  }

  set teacherSearchPageActiveTab(activeTab: string) {
    this.teacherAppSearchPageActiveTab = activeTab;
    Storage.set({ key: 'teacherSearchPageActiveTab', value: activeTab }).then(() => { });
  }

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

  async clear() {
    this.activeAppPages = [];
    await Storage.clear();
    this.activeProfile = null;
  }
}
