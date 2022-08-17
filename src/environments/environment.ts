// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import 'zone.js/dist/zone-error';

export const environment = {
  API_ENDPOINT: 'SignArt/',
  AppName: 'SignArt',
  MarquageFavori: 'FAV',
  production: false,
  instagram_token: 'INSTAGRAM_TOKEN',
  stripe_token: 'STRIPE_PUBLISHABLE_KEY',
  paypal_token: 'PAYPAL_CLIENT_ID',
  api_orange_url: '/api',
  service_name_orange_money:'SignArt',
  code_marchand_orange_money: '123456',
  MONTANT_SEUIL: 1000000,
  firebase :{
    apiKey: "AIzaSyBA4qsr_6eRWblnoU1K-durRurfYrnYlYw",
    authDomain: "signart-f0f18.firebaseapp.com",
    databaseURL: "https://signart-f0f18.firebaseio.com",
    projectId: "signart-f0f18",
    storageBucket: "signart-f0f18.appspot.com",
    messagingSenderId: "194595807203",
    appId: "1:194595807203:web:941414a9dfe948053e8ad6"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
