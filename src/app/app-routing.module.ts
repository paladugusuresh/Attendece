import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services';

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
    canActivate: [AuthGuard],
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
    path: 'student/profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'student/dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/student/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'holidays',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/holidays/holidays.module').then(m => m.HolidaysPageModule)
  },
  {
    path: 'student/attendance',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/student/attendance/attendance.module').then(m => m.AttendancePageModule)
  },
  {
    path: 'teacher/attendance-marking',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/teacher/attendance-marking/attendance-marking.module').then(m => m.AttendanceMarkingPageModule)
  },
  {
    path: 'teacher/students',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/teacher/students/students.module').then(m => m.StudentsPageModule)
  },
  {
    path: 'teacher/home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/teacher/home/home.module').then( m => m.HomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
