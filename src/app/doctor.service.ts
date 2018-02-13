import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Appointment } from '../app/appointment';
import { Doctor } from '../app/doctor';
import { error } from 'util';

@Injectable()
export class DoctorService {

  docColRef: AngularFirestoreCollection<Doctor>;
  appColRef: AngularFirestoreCollection<Appointment>;
  appointments: Appointment[] = [];
  doctor: Doctor;

  constructor(private afs: AngularFirestore) {}

  // getAppointments() {
  //   this.appColRef = this.afs.collection('appointments');
  //   this.appColRef.ref.where('ic', '==', this.doctor.ic).get().then(snapshot => {
  //     snapshot.forEach(doc => {
  //       console.log('doc.id: ' + doc.id, '=>', doc.data());

  //       this.appointments.push({
  //         id : doc.get('id'),
  //         description: doc.get('description'),
  //         patient_id: doc.get('patient_id'),
  //         patient_name: doc.get('patient_name'),
  //         doctor_id: doc.get('doctor_id'),
  //         doctor_name: doc.get('doctor_name'),
  //         hospital_id: doc.get('hospital_id'),
  //         date: doc.get('date'),
  //         time : doc.get('time')
  //       });

  //     });
  //   }).catch(error => {
  //     console.log(error);
  //   })

  //   return this.appointments;
  // }

  getDoctor() {
    return this.doctor;
  }

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


