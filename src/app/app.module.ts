import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoComponent } from './apps/todo-list/todo/todo.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';
import { TodoListComponent } from './apps/todo-list/todo-list.component';
import { StudentsModule } from './modules/students/students.module';
import { EstablishmentsModule } from './modules/establishments/establishments.module';
import { CoordinatorsModule } from './modules/coordinators/coordinators.module';
import { CycleModule } from './modules/cycle/cycle.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { CompetenciesModule } from './modules/competencies/competencies.module';
import { CostsModule } from './modules/costs/costs.module';
import { LevelModule } from './modules/level/level.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AssistantsModule } from './modules/assistants/assistants.module';
import { DataTablesModule } from 'angular-datatables';
import { HomepageModule } from './modules/homepage/homepage.module';
import { AllAssistantsModule } from './modules/all-assistants/all-assistants.module';
import { AllEstablishmentsModule } from './modules/all-establishments/all-establishments.module';
import { AllTeachersModule } from './modules/all-teachers/all-teachers.module';
import { StudentsCandidatesModule } from './modules/students-candidates/students-candidates.module';
import { AllStudentsModule } from './modules/all-students/all-students.module';
import { AllNewsModule } from './modules/all-news/all-news.module';
import { UsersModule } from './modules/users/users.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxChartsModule } from '@swimlane/ngx-charts';


registerLocaleData(es);





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    TodoListComponent,
    TodoComponent,
    SpinnerComponent,
    ContentAnimateDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
    StudentsModule,
    CoordinatorsModule,
    EstablishmentsModule,
    CycleModule,
    ReactiveFormsModule,
    ActivitiesModule,
    CompetenciesModule,
    CostsModule,
    LevelModule,
    TeachersModule,
    LessonsModule,
    AssistantsModule,
    HomepageModule, 
    AllAssistantsModule,
    AllEstablishmentsModule,
    AllTeachersModule,
    AllStudentsModule,
    StudentsCandidatesModule,
    DataTablesModule,
    AllNewsModule,
    UsersModule,
    NgxPaginationModule,
    NgxChartsModule
  ],
  providers: [ThemeService, {provide: LOCALE_ID, useValue: 'es-CL'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
