import { Component, OnInit } from '@angular/core';
import { CycleService } from '../../services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormGroup } from '@angular/forms';
import { CycleModel } from '../../../../../models/cycle.model';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss']
})
export class CycleComponent implements OnInit {

  cycles;
  cyclesEdit: FormGroup;
  cycle = new CycleModel;

  constructor(private CycleService: CycleService, private modalService: NgbModal){}

  ngOnInit(): void {
    this.listCycles;
  }

  listCycles(){
    this.CycleService.getCycles().subscribe((resp: any)=>{
      console.log(resp.ciclos);
      this.cycles = resp.ciclos;
      console.log(this.cycles);
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

}
