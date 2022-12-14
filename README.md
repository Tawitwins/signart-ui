## Running your UI locally

In this file are mentioned the steps to run the Signart Web project with VSCode. 

---
## Requirements

* Install Java 8 (jdk1.8.0_151) and Maven, NodeJS 14.18.1, npm 6.14.15 .
* Clone the signart parent repository from http://10.42.1.120/signart/signart-ui.git
   (if you use this call "git clone")
* Pull the latest changes with the correct branch you need to use.

---
## Deploy signartWeb UI locally with VSCode

* Install VSCode
* Click File → Open Folder → Open "SignartWeb" (project's name)
* Install NodeJS version 14.18.1
* Install angular cli with your terminal; write this : npm install -g @angular/cli
* In VS Code, src/app, right click Open Terminal, and make npm install. This may take a few minutes.
* To run the project npm start.


# Signart

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server

Run `ng serve --proxy-config proxy.config.json` for a dev server. Navigate to `http://localhost:4200/`.Use the `--port` to specifie the port (`4200` is the default port). The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

---
## Setting up pgAdmin (optional)

* Download and install pgAdmin
* Server → Create Server 
* General → Set the name as msis
* Connection → Set the host name as : 10.42.1.205 (ask for the postgres database's ipAdress if the default one doesn't work)
  - Username : signart (default)
  - password : passer123 (default)
  (ask for the credentials if the defaults one doesn't work)
_ You are still able to use a local database (localhost).