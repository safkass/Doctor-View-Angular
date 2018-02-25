import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoComponent }  from './video/video.component';
import { ListComponent } from './list/list.component';
import { AuthComponent } from './auth/auth.component';
import { PatientComponent } from './patient/patient.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'list/:ic', component: ListComponent },
  { path: 'patient/:id', component: PatientComponent },
  { path: 'video/:id', component: VideoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {
}

