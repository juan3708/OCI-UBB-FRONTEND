import { Component, OnInit, DoCheck } from '@angular/core';
import { CycleService } from '../modules/cycle/services/cycle.service';
import { UserPagesService } from 'src/app/user-pages/services/user-pages.service';
import Swal from 'sweetalert2';
import { HomepageService } from '../modules/homepage/services/homepage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, DoCheck {

  cicloOld;
  cicloNew;
  ciclo = {
    alumnosParticipantes: 0,
    establecimientos: Array()
  }
  user = {
    rol: {
      nombre: ""
    },
    rut: ""
  };
  checkCiclos = 1;
  checkCoordinadores = 1;
  checkEstablecimientos = 1;
  totalGastos = 0;
  gastos = [];
  presupuestoCiclo = 0;
  url = 'http://127.0.0.1:8000/storage/images/';
  p:any;
  noticias;
  noticia;


  constructor(private cycleService: CycleService, private usersPagesService: UserPagesService,  private homepageService: HomepageService, private modalService: NgbModal) {
    this.cicloOld = {};
  }


  ngOnInit() {
    this.checkSystem();
    this.listAllNews();
  }

  ngDoCheck(): void {
    this.user = this.usersPagesService.getUser();
    if (this.cycleService.cycle.id != undefined) {
      this.cicloNew = this.cycleService.cycle;
      if (this.cicloOld != this.cicloNew) {
        this.cicloOld = this.cicloNew;
        console.log(this.user);
        if (this.cicloOld.id != undefined) {
          this.getCycle(this.cicloOld.id);
        }
      }
    }
  }

  listAllNews() {
    this.homepageService.getNews().subscribe((resp: any) => {
      this.noticias = resp.noticias;
    })
  }
  
  setNew(news, modal){
    this.noticia = JSON.parse(JSON.stringify(news));
    this.modalService.open(modal, {size: 'xl'})
  }

  checkSystem() {
    this.cycleService.checkSystem().subscribe((resp: any) => {
      this.checkCiclos = resp.ciclos;
      this.checkCoordinadores = resp.coordinadores;
      this.checkEstablecimientos = resp.establecimientos;
    })
  }

  getCycle(id) {
    let data = {
      id
    };
    Swal.fire({
      title: 'Espere porfavor...',
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.ciclo = resp.ciclo;
        this.gastos = resp.ciclo.gastos;
        this.presupuestoCiclo = Number(resp.ciclo.presupuesto);
        Swal.close();
      }
    })

  }

  // date: Date = new Date();

  // visitSaleChartData = [{
  //   label: 'CHN',
  //   data: [20, 40, 15, 35, 25, 50, 30, 20],
  //   borderWidth: 1,
  //   fill: false,
  // },
  // {
  //   label: 'USA',
  //   data: [40, 30, 20, 10, 50, 15, 35, 40],
  //   borderWidth: 1,
  //   fill: false,
  // },
  // {
  //   label: 'UK',
  //   data: [70, 10, 30, 40, 25, 50, 15, 30],
  //   borderWidth: 1,
  //   fill: false,
  // }];

  // visitSaleChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  // visitSaleChartOptions = {
  //   responsive: true,
  //   legend: false,
  //   scales: {
  //     yAxes: [{
  //       ticks: {
  //         display: false,
  //         min: 0,
  //         stepSize: 20,
  //         max: 80
  //       },
  //       gridLines: {
  //         drawBorder: false,
  //         color: 'rgba(235,237,242,1)',
  //         zeroLineColor: 'rgba(235,237,242,1)'
  //       }
  //     }],
  //     xAxes: [{
  //       gridLines: {
  //         display: false,
  //         drawBorder: false,
  //         color: 'rgba(0,0,0,1)',
  //         zeroLineColor: 'rgba(235,237,242,1)'
  //       },
  //       ticks: {
  //         padding: 20,
  //         fontColor: "#9c9fa6",
  //         autoSkip: true,
  //       },
  //       categoryPercentage: 0.4,
  //       barPercentage: 0.4
  //     }]
  //   }
  // };

  // visitSaleChartColors = [
  //   {
  //     backgroundColor: [
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //     ],
  //     borderColor: [
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //       'rgba(154, 85, 255, 1)',
  //     ]
  //   },
  //   {
  //     backgroundColor: [
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //     ],
  //     borderColor: [
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //       'rgba(254, 112, 150, 1)',
  //     ]
  //   },
  //   {
  //     backgroundColor: [
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //     ],
  //     borderColor: [
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //       'rgba(177, 148, 250, 1)',
  //     ]
  //   },
  // ];

  trafficChartData = [
    {
      data: [30, 30, 40],
    }
  ];

  trafficChartLabels = ["Search Engines", "Direct Click", "Bookmarks Click"];

  trafficChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: false,
  };

  trafficChartColors = [
    {
      backgroundColor: [
        'rgba(177, 148, 250, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(132, 217, 210, 1)'
      ],
      borderColor: [
        'rgba(177, 148, 250, .2)',
        'rgba(254, 112, 150, .2)',
        'rgba(132, 217, 210, .2)'
      ]
    }
  ];



}
