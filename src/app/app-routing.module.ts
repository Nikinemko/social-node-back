import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterLink } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, RouterLink],
})
export class AppRoutingModule {}
