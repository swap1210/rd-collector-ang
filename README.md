# RdCollectorAng

## v2.0.0 Features

<span style="color:green">✔️</span> Got ride of subscribe unsubscribe hell<br>
<span style="color:green">✔️</span> no more async await, or async pipe<br>
<span style="color:green">✔️</span> Zoneless: No dependency on [zone.js](https://www.npmjs.com/package/zone.js?activeTab=readme)<br>
<span style="color:green">✔️</span> [@angular/fire independent](https://github.com/angular/angularfire) as it is not zoneless friendly yet.<br>

## How to setup project locally:

### Step 1:

`npm i`

### Step 2:

for first run generate environment files

`npm start`

for consecutive runs (as environment files have already been created)

`ng serve`

### Step 3:

Make sure you have Firebase project setup and yu have API key for your respective project, now paste that <b>key</b> in the environments/environment after the previous step.

<b>firebase.apiKey</b>: your Firebase API key.

<b>isLocal</b>: will be false if you are deploying it to an instance or production.
