import { Component, OnInit } from '@angular/core';
import { EstablishmentsService } from '../../services/establishments.service';

@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.component.html',
  styleUrls: ['./establishments.component.scss']
})
export class EstablishmentsComponent implements OnInit {

  establishments;
  constructor(private establishmentService: EstablishmentsService) { }

  ngOnInit(): void {
    this.listEstablishments();
  }

  listEstablishments(){
    this.establishmentService.getEstablishments().subscribe((resp:any)=>{
      console.log(resp.establecimientos);
      this.establishments=resp.establecimientos;
      console.log(this.establishments);
    })
  }

}
