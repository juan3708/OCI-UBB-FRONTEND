import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormsModule } from '@angular/forms';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent,canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'profesor', 'ayudante', 'director']} },
  { path: 'change-email', component: ChangeEmailComponent,canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'profesor', 'ayudante', 'director']} },


]

@NgModule({
  declarations: [LoginComponent, ChangePasswordComponent, ChangeEmailComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UserPagesModule { }
