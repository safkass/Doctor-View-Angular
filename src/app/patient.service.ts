import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { error } from 'util';
import { Patient } from '../app/patient';

@Injectable()
export class PatientService {

  patientColdRef: AngularFirestoreCollection<Patient>;
  patientDoc: AngularFirestoreDocument<Patient>;
  patient: Patient;
  patientDiagnosis = {
    symptoms : ''
  };

  constructor(private afs: AngularFirestore) {

    this.patientColdRef = this.afs.collection('patients');

   }

   getPatient(patientId: string){

    this.patientColdRef = this.afs.collection('patients');
    this.patientColdRef.ref.where('id', '==', patientId).get().then(snapshot => {
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

        this.patientDiagnosis = {
          symptoms : this.patient.diagnosis_history['symtoms']
        }

      });
    }).catch(error => {
      console.log(error);
    })

    console.log("patient diagnosis history: " + this.patient.diagnosis_history['symtoms']);    

    return this.patient;
  }

}
