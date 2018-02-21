import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Doctor } from '../app/doctor';
import { error } from 'util';

@Injectable()
export class DoctorService {

  docColRef: AngularFirestoreCollection<Doctor>;
  doctor: Doctor;

  constructor(private afs: AngularFirestore) {}

  getDoctor() {
    return this.doctor;
  }

  // Verify the login doctor
  onSubmit(ic: string){
    this.docColRef = this.afs.collection('doctors');
    this.docColRef.ref.where('ic', '==', ic).get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log('Doctor id: ' + doc.get('id'));
        this.doctor = {
          id : doc.get('id'),
          name: doc.get('name'),
          ic : doc.get('ic'),
          position: doc.get('position'),
          age: doc.get('age'),
          email: doc.get('email'),
          contact_number: doc.get('contact_number'),
          hospital_id : doc.get('hospital_id')
        };
      })
    })

  }
 }


