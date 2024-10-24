import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterLink } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './noauth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'profile-picture',
    component: ProfilePictureComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, RouterLink],
})
export class AppRoutingModule {}
