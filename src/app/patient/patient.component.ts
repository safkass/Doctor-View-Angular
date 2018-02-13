import { Component, OnInit } from '@angular/core';
import { Patient } from '../patient';
import { Location } from '@angular/common';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { PatientService} from '../patient.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  id: string;
  patientColdRef: AngularFirestoreCollection<Patient>;
  patientDoc: AngularFirestoreDocument<Patient>;
  patient: Patient;
  patientDiagnosis = {
    symptoms : ''
  };

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private location: Location) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params.id;
    })

     // this.patient = this.patientService.getPatient("147b6d19-c13f-8603-82fc-76ba0ad3c492");
    // console.log("patient diagnosis22 history: " + this.patient.diagnosis_history['symtoms']);
    this.patientColdRef = this.afs.collection('patients');
    this.patientColdRef.ref.where('id', '==', this.id).get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log('doc.id: ' + doc.id, '=>', doc.data());

        this.patient = {
          id : doc.get('id'),
          name: doc.get('name'),
          ic: doc.get('ic'),
          age: doc.get('age'),
          sex: doc.get('sex'),
          hospital_id : doc.get('hospital_id'),
          diagnosis_history : doc.get('diagnosis_history')
        };

        
        // console.log("patient diagnosis history: " + this.patient.diagnosis_history['diagnose_condition']['acuteness']);
        // this.category = this.patient.diagnosis_history['diagnose_condition']['categories'];
        // console.log("patient categories: " + this.category[0]);


        this.patient.diagnosis_history = {
          acuteness : this.patient.diagnosis_history['diagnose_condition']['acuteness'],
          categories : this.patient.diagnosis_history['diagnose_condition']['categories'],
          common_name : this.patient.diagnosis_history['diagnose_condition']['common_name'],
          hint : this.patient.diagnosis_history['diagnose_condition']['extras']['hint'],
          prevalence : this.patient.diagnosis_history['diagnose_condition']['prevalence'],
          severity : this.patient.diagnosis_history['diagnose_condition']['severity'],
          triage_level : this.patient.diagnosis_history['diagnose_condition']['triage_level'],
          initial_symptoms : this.patient.diagnosis_history['initial_symptoms']['name'],
          possible_condition : this.patient.diagnosis_history['possible_conditions']['common_name'],
          condition_probability : this.patient.diagnosis_history['possible_conditions']['probability'],
          questions : this.patient.diagnosis_history['questions']
        }

      });
    }).catch(error => {
      console.log(error);
    })        

  }

  goBack() {
    this.location.back();
  }

}
