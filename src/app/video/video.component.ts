import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { PatientService} from '../patient.service';
import { Appointment } from '../appointment';
import 'jquery';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})

export class VideoComponent implements OnInit {

  globalUsername: string;
  appointment: Appointment;
  appointment_id: string;
  appColRef: AngularFirestoreCollection<Appointment>;
  appDoc: AngularFirestoreDocument<Appointment>;
  
  constructor(private afs: AngularFirestore, private route: ActivatedRoute) {
	  this.appColRef = this.afs.collection('appointments');
  }

  ngOnInit() {
	this.globalUsername = '';

	this.route.params.subscribe(params => {
		this.appointment_id = params.id;
		this.appDoc = this.afs.doc<Appointment>(`appointments/${this.appointment_id}`);
	})

	
	this.appDoc.valueChanges().subscribe((appRef => {
		if(appRef) {
			this.appointment = {
				id : appRef.id,
				description : appRef.description,
				patient_id : appRef.patient_id,
				patient_name : appRef.patient_name,
				doctor_id : appRef.doctor_id,
				doctor_ic : appRef.doctor_ic,
				doctor_name : appRef.doctor_name,
				hospital_id : appRef.hospital_id,
				hospital_name : appRef.hospital_name,
				date : appRef.date,
				time : appRef.time,
				diagnosis_price : appRef.diagnosis_price
			}
		}
	}))

	$('div#price-form').css('display', 'none');

	/*** After successful authentication, show user interface ***/

	let showUI = () => {
		$('div#call').show();
		$('form#userForm').css('display', 'none');
		$('div#userInfo').css('display', 'inline');
		$('h3#login').css('display', 'none');
		$('video').show();
		$('span#username').text(this.globalUsername);
	}

	/*** If no valid session could be started, show the login interface ***/

	let showLoginUI = () => {
		$('form#userForm').css('display', 'inline');
	}

	//*** Set up sinchClient ***/

	let sinchClient = new SinchClient({
		applicationKey: 'cc277e12-542f-4612-97d7-f67e7b2f85e5',
		capabilities: {calling: true, video: true},
		supportActiveConnection: true,
		//Note: For additional loging, please uncomment the three rows below
		onLogMessage: (message) => {
			console.log(message);
		},
	});

	sinchClient.startActiveConnection();

	/*** Name of session, can be anything. ***/

	let sessionName = 'sinchSessionVIDEO-' + sinchClient.applicationKey;


	/*** Check for valid session. NOTE: Deactivated by default to allow multiple browser-tabs with different users. ***/

	let sessionObj = JSON.parse(localStorage[sessionName] || '{}');
	if(sessionObj.userId) { 
		sinchClient.start(sessionObj)
			.then(() => {
				this.globalUsername = sessionObj.userId;
				//On success, show the UI
				showUI();
				//Store session & manage in some way (optional)
				localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
			})
			.fail(() => {
				//No valid session, take suitable action, such as prompting for username/password, then start sinchClient again with login object
				showLoginUI();
			});
	}
	else {
		showLoginUI();
	}


	/*** Create user and start sinch for that user and save session in localStorage ***/

	$('button#createUser').on('click', (event) => {
		event.preventDefault();
		$('button#loginUser').attr('disabled', 'true');
		$('button#createUser').attr('disabled', 'true');
		clearError();

		let signUpObj = {
		username : '' + $('input#username').val(),
		password :$('input#password').val()
	};
		//Use Sinch SDK to create a new user
		sinchClient.newUser(signUpObj, (ticket) => {
			//On success, start the client
			sinchClient.start(ticket, () => {
				this.globalUsername = signUpObj.username;
				//On success, show the UI
				showUI();

				//Store session & manage in some way (optional)
				localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
			}).fail(handleError);
		}).fail(handleError);
	});


	/*** Login user and save session in localStorage ***/

	$('button#loginUser').on('click', (event) => {
		event.preventDefault();
		$('button#loginUser').attr('disabled', 'true');
		$('button#createUser').attr('disabled', 'true');
		clearError();

		let signInObj = {
		username: '' + $('input#username').val(),
		password: $('input#password').val()
	};

		//Use Sinch SDK to authenticate a user
		sinchClient.start(signInObj, () => {
			this.globalUsername = signInObj.username;
			//On success, show the UI
			showUI();

			//Store session & manage in some way (optional)
			localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
		}).fail(handleError);
	});

	/*** Define listener for managing calls ***/

	let callListeners = {
		onCallProgressing: (call) => {
			$('audio#ringback').prop("currentTime",0);
			$('audio#ringback').trigger("play");

			//Report call stats
			$('div#callLog').append('<div id="stats">Ringing...</div>');
		},
		onCallEstablished: (call) => {
			$('video#outgoing').attr('src', call.outgoingStreamURL);
			$('video#incoming').attr('src', call.incomingStreamURL);
			$('audio#ringback').trigger("pause");
			$('audio#ringtone').trigger("pause");

			//Report call stats
			let callDetails = call.getDetails();
			$('div#callLog').append('<div id="stats">Answered at: '+(callDetails.establishedTime && new Date(callDetails.establishedTime))+'</div>');
		},
		onCallEnded: (call) => {
			$('audio#ringback').trigger("pause");
			$('audio#ringtone').trigger("pause");

			$('video#outgoing').attr('src', '');
			$('video#incoming').attr('src', '');

			$('button').removeClass('incall');
			$('button').removeClass('callwaiting');

			//Report call stats
			let callDetails = call.getDetails();
			$('div#callLog').append('<div id="stats">Ended: '+new Date(callDetails.endedTime)+'</div>');
			$('div#callLog').append('<div id="stats">Duration (s): '+callDetails.duration+'</div>');
			$('div#callLog').append('<div id="stats">End cause: '+call.getEndCause()+'</div>');
			if(call.error) {
				$('div#callLog').append('<div id="stats">Failure message: '+call.error.message+'</div>');
			}

			$('div#price-form').css('display', 'inline');
			
		}
	}

	/*** Set up callClient and define how to handle incoming calls ***/

	let callClient = sinchClient.getCallClient();
	callClient.initStream().then(() => { // Directly init streams, in order to force user to accept use of media sources at a time we choose
		$('div.frame').not('#chromeFileWarning').show();
	}); 
	let call;

	callClient.addEventListener({
	onIncomingCall: (incomingCall) => {
		//Play some groovy tunes 
		$('audio#ringtone').prop("currentTime",0);
		$('audio#ringtone').trigger("play");

		//Print statistics
		$('div#callLog').append('<div id="title">Incoming call from ' + incomingCall.fromId + '</div>');
		$('div#callLog').append('<div id="stats">Ringing...</div>');
		$('button').addClass('incall');

		//Manage the call object
		call = incomingCall;
		call.addEventListener(callListeners);
		$('button').addClass('callwaiting');

		//call.answer(); //Use to test auto answer
		call.hangup();
	}
	});

	$('button#answer').click((event) => {
		event.preventDefault();

		if($(this).hasClass("callwaiting")) {
			clearError();

			try {
				call.answer();
				$('button').removeClass('callwaiting');
			}
			catch(error) {
				handleError(error);
			}
		}
	});

	/*** Make a new data call ***/

	$('button#call').click((event) => {
		event.preventDefault();

		if(!$(this).hasClass("incall") && !$(this).hasClass("callwaiting")) {
			clearError();

			$('button').addClass('incall');

			$('div#callLog').append('<div id="title">Calling ' + $('input#callUserName').val()+'</div>');

			console.log('Placing call to: ' + $('input#callUserName').val());
			call = callClient.callUser($('input#callUserName').val());

			call.addEventListener(callListeners);
		}
	});

	/*** Hang up a call ***/

	$('button#hangup').click((event) => {
		event.preventDefault();

		if($(this).hasClass("incall")) {
			clearError();
			
			console.info('Will request hangup..');

			call && call.hangup();
		}
	});

	/*** Log out user ***/

	$('button#logOut').on('click', (event) => {
		event.preventDefault();
		clearError();

		//Stop the sinchClient
		sinchClient.terminate();
		//Note: sinchClient object is now considered stale. Instantiate new sinchClient to reauthenticate, or reload the page.

		//Remember to destroy / unset the session info you may have stored
		delete localStorage[sessionName];

		//Allow re-login
		$('button#loginUser').attr('disabled', 'false');
		$('button#createUser').attr('disabled', 'false');
		
		//Reload page.
		window.location.reload();
	});


	/*** Handle errors, report them and re-enable UI ***/

	let handleError = (error) => {
		//Enable buttons
		$('button#createUser').prop('disabled', false);
		$('button#loginUser').prop('disabled', false);

		//Show error
		$('div.error').text(error.message);
		$('div.error').show();
	}

	/** Always clear errors **/
	let clearError = ()  => {
		$('div.error').hide();
	}

	/** Chrome check for file - This will warn developers of using file: protocol when testing WebRTC **/
	if(location.protocol == 'file:' && navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
		$('div#chromeFileWarning').show();
	}

	$('button').prop('disabled', false); //Solve Firefox issue, ensure buttons always clickable after load
	
  }

  onSubmit() {
	var price = $('input#price').val();
	this.appointment.diagnosis_price = +price;

	this.appDoc.update(this.appointment).then(() => {
		console.log('price1: ' + this.appointment.diagnosis_price)
		console.log('updated appointment price successfully');
	}).catch((error => {
		this.appDoc.set(this.appointment);
		console.log('error!! - ' + error);
	}))
  }

}
