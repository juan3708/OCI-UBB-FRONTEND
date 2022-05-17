import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  noticias;
  constructor(private router: Router, private newsService: NewsService) { }

  ngOnInit(): void {
    this.listAllNews();
  }

  listAllNews(){
    this.newsService.getNews().subscribe((resp:any) => {
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
