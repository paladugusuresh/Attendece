import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  activeProfile: any;
  activeAppPages = [];
  studentTask: any;
  isTaskUpdated = false;

  get activeModuleId(): any {
    return this.nativeStorage.getItem('activeModule').then((res: string) => res);
  }

  set activeModuleId(val: any) {
    this.nativeStorage.setItem('activeModule', val).then(() => {});
  }

  constructor(private nativeStorage: NativeStorage) { }

  getProfile(): any {
    if (this.activeProfile) {
      return this.activeProfile;
    } else if (localStorage.getItem('sessionData')) {
      this.activeProfile = JSON.parse(localStorage.getItem('sessionData'));
      return this.activeProfile;
    } else {return null;}
  }

  setProfile(val: any) {
    this.activeProfile = val;
    localStorage.setItem('sessionData', JSON.stringify(val));
  }

  clear() {
    this.activeAppPages = [];
    this.activeProfile = null;
  }
}
