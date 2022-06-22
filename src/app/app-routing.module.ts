import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'profesor', 'ayudante', 'director']} },
  { path: 'basic-ui', loadChildren: () => import('./basic-ui/basic-ui.module').then(m => m.BasicUiModule) },
  { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsDemoModule) },
  { path: 'forms', loadChildren: () => import('./forms/form.module').then(m => m.FormModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'general-pages', loadChildren: () => import('./general-pages/general-pages.module').then(m => m.GeneralPagesModule) },
  { path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
  { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
  { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
  { path: 'students', loadChildren: () => import('./modules/students/students-routing.module').then(m => m.StudentsRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'profesor', 'ayudante', 'director']} },
  { path: 'coordinators', loadChildren: () => import('./modules/coordinators/coordinators-routing.module').then(m => m.CoordinatorsRoutingModule), canActivate:[AuthGuard], data:{role:['admin']} },
  { path: 'establishments', loadChildren: () => import('./modules/establishments/establishments-routing.module').then(m => m.EstablishmentsRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador']} },
  { path: 'cycle', loadChildren: () => import('./modules/cycle/cycle-routing.module').then(m => m.CycleRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador','director']} },
  { path: 'activities', loadChildren: () => import('./modules/activities/activities-routing.module').then(m => m.ActivitiesRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador']} },
  { path: 'competencies', loadChildren: () => import('./modules/competencies/competencies-routing.module').then(m => m.CompetenciesRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador','director']} },
  { path: 'costs', loadChildren: () => import('./modules/costs/costs-routing.module').then(m => m.CostsRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'director']} },
  { path: 'level', loadChildren: () => import('./modules/level/level-routing.module').then(m => m.LevelRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador']} },
  { path: 'lessons', loadChildren: () => import('./modules/lessons/lessons-routing.module').then(m => m.LessonsRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'profesor', 'ayudante']} },
  { path: 'teachers', loadChildren: () => import('./modules/teachers/teachers-routing.module').then(m => m.TeachersRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador']} },
  { path: 'assistants', loadChildren: () => import('./modules/assistants/assistants-routing.module').then(m => m.AssistantsRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'profesor']} },
  { path: '', loadChildren: () => import('./modules/homepage/homepage-routing.module').then(m => m.HomepageRoutingModule), },
  { path: 'all-assistants', loadChildren: () => import('./modules/all-assistants/all-assistants-routing.module').then(m => m.AllAssistantsRoutingModule), canActivate:[AuthGuard], data:{role:['admin']} },
  { path: 'all-establishments', loadChildren: () => import('./modules/all-establishments/all-establishments-routing.module').then(m => m.AllEstablishmentsRoutingModule), canActivate:[AuthGuard], data:{role:['admin']} },
  { path: 'all-teachers', loadChildren: () => import('./modules/all-teachers/all-teachers-routing.module').then(m => m.AllTeachersRoutingModule), canActivate:[AuthGuard], data:{role:['admin']} },
  { path: 'all-students', loadChildren: () => import('./modules/all-students/all-students-routing.module').then(m => m.AllStudentsRoutingModule), canActivate:[AuthGuard], data:{role:['admin']} },
  { path: 'all-news', loadChildren: () => import('./modules/all-news/all-news-routing.module').then(m => m.AllNewsRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador']} },
  { path: 'studentscandidates', loadChildren: () => import('./modules/students-candidates/students-candidates-routing.module').then(m => m.StudentsCandidatesRoutingModule), canActivate:[AuthGuard], data:{role:['admin', 'coordinador', 'director']} },
  { path: 'users', loadChildren: () => import('./modules/users/users-routing.module').then(m => m.UsersRoutingModule), canActivate:[AuthGuard], data:{role:['admin']} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
