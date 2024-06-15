import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// import { initializeApp } from 'firebase/app';
// import { environment } from '../src/environments/environment';
import { firebaseApp } from './app/firebase-config';

// initializeApp(environment.firebase);
const firebaseAppInitalized = firebaseApp;
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
