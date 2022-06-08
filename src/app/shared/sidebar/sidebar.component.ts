import { Component, DoCheck, OnInit } from '@angular/core';
import { UserPagesService } from 'src/app/user-pages/services/user-pages.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, DoCheck {
  public uiBasicCollapsed = false;
  public studentsCollapsed = false;
  public teachersCollapsed = false;
  public establishmentsCollapsed = false;
  public assistantsCollapsed = false;
  public samplePagesCollapsed = false;

  userLocal;
  
  constructor(private userPagesService: UserPagesService) { 
    this.userLocal = {};
  }

  ngOnInit() {
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

  ngDoCheck(): void {
    if(localStorage.getItem('access_token')){
      let user = this.userPagesService.getUserByToken();
      if(user.id != this.userLocal.id){
        this.userLocal = user;
      }
    }
  }

}
