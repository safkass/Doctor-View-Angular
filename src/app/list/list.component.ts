import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Appointment } from '../appointment';
import { DoctorService } from '../doctor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  appColRef: AngularFirestoreCollection<Appointment>;
  appointments: Appointment[] = [];
  ic: string;

  constructor(private doctorService: DoctorService, private afs: AngularFirestore, private route: ActivatedRoute) { 
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.ic = params.ic;
    })
    
    // Display all appointments of the particular doctor
    this.appColRef = this.afs.collection('appointments');
    this.appColRef.ref.where('doctor_ic', '==', this.ic).get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log('doc.id: ' + doc.id, '=>', doc.data());

        this.appointments.push({
          id : doc.get('id'),
          description: doc.get('description'),
          patient_id: doc.get('patient_id'),
          patient_name: doc.get('patient_name'),
          doctor_id: doc.get('doctor_id'),
          doctor_ic: doc.get('doctor_ic'),
          doctor_name: doc.get('doctor_name'),
          hospital_id: doc.get('hospital_id'),
          hospital_name: doc.get('hospital_name'),
          date: doc.get('date'),
          time: doc.get('time'),
          diagnosis_price: doc.get('diagnosis_price')
        });

      });
    }).catch(error => {
      console.log(error);
    })
   
    this.doctorService.onSubmit(this.ic);
  }

  logout() {
    
  }

}
