import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LevelRoutingModule } from './level-routing.module';
import { LevelComponent } from './components/level/level.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [LevelComponent],
  imports: [
    CommonModule,
    LevelRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LevelModule { }
