import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomepageService } from '../../services/homepage.service';

@Component({
  selector: 'app-featured-homepage',
  templateUrl: './featured-homepage.component.html',
  styleUrls: ['./featured-homepage.component.scss']
})
export class FeaturedHomepageComponent implements OnInit {

  noticias;
  url = 'http://127.0.0.1:8000/storage/images/';
  constructor(private router:Router, private homepageService: HomepageService) { }

  ngOnInit(): void {
  }

}
