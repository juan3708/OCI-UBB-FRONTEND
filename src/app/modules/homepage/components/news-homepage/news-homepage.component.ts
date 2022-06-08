import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomepageService } from '../../services/homepage.service';

@Component({
  selector: 'app-news-homepage',
  templateUrl: './news-homepage.component.html',
  styleUrls: ['./news-homepage.component.scss']
})
export class NewsHomepageComponent implements OnInit {
  
  noticias;
  constructor(private router: Router, private homepageService: HomepageService) { }

  ngOnInit(): void {
    this.listAllNews();
  }

  listAllNews(){
    this.homepageService.getNews().subscribe((resp:any) => {
      console.log(resp);
      this.noticias = resp.noticias;
    })
  }

  onSelectNews(news){
    console.log(news);
    let title = news.titulo.replaceAll(' ', '-').toLowerCase();
    this.router.navigate(['/news', title], {state:{
      news
    }});
    console.log(title);
  }
}
