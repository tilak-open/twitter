import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationComponent } from './components/notification/notification.component'; // Import the NotificationComponent
import { AuthGuard } from './guards/auth.guard';
import { HeaderComponent } from './components/header/header.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard],
      children: [
        {
          path: '',
          redirectTo: 'header', 
          pathMatch: 'full'
        },
        {
          path: 'header', // child route path
          component: HeaderComponent, // child route component that the router renders
        },
        {
          path: 'notification',
          component: NotificationComponent, // another child route component that the router renders
        },
      ],
     },
    { path: 'login', component: LoginComponent},
    // { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' },
];