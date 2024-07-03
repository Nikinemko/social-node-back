import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterLink } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, RouterLink],
})
export class AppRoutingModule {}
