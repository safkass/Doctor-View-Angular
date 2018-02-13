import { Component, OnInit } from '@angular/core';
import { Patient } from '../patient';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { PatientService} from '../patient.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  patientColdRef: AngularFirestoreCollection<Patient>;
  patientDoc: AngularFirestoreDocument<Patient>;
  patient: Patient;
  patientDiagnosis = {
    symptoms : ''
  };
  constructor(private afs: AngularFirestore) { }

  ngOnInit() {

    // this.patient = this.patientService.getPatient("147b6d19-c13f-8603-82fc-76ba0ad3c492");
    // console.log("patient diagnosis22 history: " + this.patient.diagnosis_history['symtoms']);
    this.patientColdRef = this.afs.collection('patients');
    this.patientColdRef.ref.where('id', '==', "147b6d19-c13f-8603-82fc-76ba0ad3c492").get().then(snapshot => {
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

        console.log("patient name: " + this.patient.name);
        console.log("patient diagnosis history: " + this.patient.diagnosis_history['symtoms']);

        this.patientDiagnosis = {
          symptoms : this.patient.diagnosis_history['symtoms']
        }

      });
    }).catch(error => {
      console.log(error);
    })        
    
  } 

}
