import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  activeProfile: any;
  activeAppPages = [];
  studentTask: any;
  isTaskUpdated = false;

  get activeModuleId(): any {
    return localStorage.getItem('activeModule');
  }

  set activeModuleId(val: any) {
    localStorage.setItem('activeModule', val);
  }

  constructor() { }

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

  get teacherPreferredSchoolId(): number {
    if (localStorage.getItem('teacherPreferredSchoolId')) {
      return +localStorage.getItem('teacherPreferredSchoolId');
    }
    return 0;
  }

  set teacherPreferredSchoolId(id: number) {
    localStorage.setItem('teacherPreferredSchoolId', `${id}`);
  }

  clear() {
    this.activeAppPages = [];
    this.activeProfile = null;
  }
}
