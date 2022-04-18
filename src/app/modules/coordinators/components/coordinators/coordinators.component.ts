import { Component, OnInit } from '@angular/core';
import { CoordinatorsService } from '../../services/coordinators.service';

@Component({
  selector: 'app-coordinators',
  templateUrl: './coordinators.component.html',
  styleUrls: ['./coordinators.component.scss']
})
export class CoordinatorsComponent implements OnInit {

  coordinators;
  constructor(private coordinatorsService: CoordinatorsService) { }

  ngOnInit(): void {
    this.listCoordinators();
  }

  listCoordinators(){
    this.coordinatorsService.getCoordinators().subscribe((resp:any)=>{
      console.log(resp.Coordinadores);
      this.coordinators=resp.Coordinadores;
      console.log(this.coordinators);
    })
  }

}
