import { formatDate } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { CycleService } from 'src/app/modules/cycle/services/cycle.service';
import { UserPagesService } from 'src/app/user-pages/services/user-pages.service';
import { CycleModel } from 'src/models/cycle.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit, DoCheck {
  public iconOnlyToggled = false;
  public sidebarToggled = false;

  userLocal;
  cycles;
  currentDate;
  cycle = new CycleModel();

  constructor(config: NgbDropdownConfig, private cycleService: CycleService, private userPagesService: UserPagesService, private router: Router) {
    config.placement = 'bottom-right';
    this.userLocal = {};
  }

  ngOnInit() {
    this.listCycles();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getCyclePerFinishtDate();
  }

  ngDoCheck(): void {
    if(this.userPagesService.getUser()){
      let user = this.userPagesService.getUser();
      if(user.id != this.userLocal.id){
        this.userLocal = user;
      }
    }
  }

  logout(){
    this.userPagesService.logout();
    this.router.navigateByUrl('/user-pages/login');
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if(this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if(this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  getCycle(id) {
    let data = {
      ciclo_id: id
    };
    let user = this.userPagesService.getUser();
    this.cycleService.getStudentsCandidatePerCycle(data).subscribe((resp: any) => {
      resp.ciclo;
      this.cycleService.cycle = resp.ciclo;
    });
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getStudentsCandidatePerCyclePerFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
        this.cycleService.cycle = resp.ciclo;
      }
    })
  }

  // toggle right sidebar
  // toggleRightSidebar() {
  //   document.querySelector('#right-sidebar').classList.toggle('open');
  // }

}
