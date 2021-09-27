import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'student/dashboard',
    loadChildren: () => import('./pages/student/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'teacher/dashboard',
    loadChildren: () => import('./pages/teacher/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'holidays',
    loadChildren: () => import('./pages/holidays/holidays.module').then(m => m.HolidaysPageModule)
  },
  {
    path: 'student/attendance',
    loadChildren: () => import('./pages/student/attendance/attendance.module').then(m => m.AttendancePageModule)
  },
  {
    path: 'teacher/attendance-marking',
    loadChildren: () => import('./pages/teacher/attendance-marking/attendance-marking.module').then(m => m.AttendanceMarkingPageModule)
  },
  {
    path: 'teacher/students',
    loadChildren: () => import('./pages/teacher/students/students.module').then(m => m.StudentsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
