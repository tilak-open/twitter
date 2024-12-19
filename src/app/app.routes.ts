import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationComponent } from './components/notification/notification.component'; // Import the NotificationComponent
import { AuthGuard } from './guards/auth.guard';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowComponent } from './components/follow/follow.component';

export const routes: Routes = [
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'header',
        pathMatch: 'full'
      },
      {
        path: 'header',
        component: HeaderComponent,
      },
      {
        path: 'follow',
        component: FollowComponent,
      },
      {
        path: 'notification',
        component: NotificationComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];