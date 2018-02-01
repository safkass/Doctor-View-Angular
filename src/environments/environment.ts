// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDRrxc0kF0LONwYjtXx7RIBeDMfw_rKXXE',
    authDomain: 'pocket-health-advisor.firebaseapp.com',
    databaseURL: 'https://pocket-health-advisor.firebaseio.com',
    projectId: 'pocket-health-advisor',
    storageBucket: 'pocket-health-advisor.appspot.com',
    messagingSenderId: '949856295335'
  }
};
