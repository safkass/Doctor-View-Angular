import { Component, OnInit } from '@angular/core';
import { Doctor } from '../doctor';
import { DoctorService } from '../doctor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  ic : string = null;
  password : string = null;

  constructor(private doctorService: DoctorService, private location: Location) { }

  ngOnInit() {
  }

  // onSubmit() {
  //   this.doctorService.onSubmit(this.ic);

  // }

}
