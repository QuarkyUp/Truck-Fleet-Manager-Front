# Truck-Fleet-Manager

Our application propose **FMaaS** (Fleet Manager as a Service).

Our backend is able to compute the best path for your trucks in order to maximize profit and lower travelled distance.
We extensively use genetic algorithm to make it happen.

As for our backend, we use json-api and mongodb to manage our API's and your trucks data.
Our frontend is a web application based on the Ember framework. We use Google Maps API in order to display the datas on screen and Bootstrap beautify it.

**Project not completed** : nous souhaitons continuer (un peu) le développement du projet

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [docker-compose](https://docs.docker.com/compose/install/) (with Docker)

## Installation

Clone this repository with its submodules (Backend as Docker-Compose) recursively using :
* `git clone --recursive https://github.com/QuarkyUp/Truck-Fleet-Manager-Front/`

Update submodule
* `git submodule update --remote --recursive`

Change to the cloned repository using :
* `cd Truck-Fleet-Manager-Front`

Install dependencies :
* `npm install --only=dev`

## How to use

### Launch the backend
If you want the latest version of the docker submodule :
* `git submodule update --remote --recursive`

Start docker-compose which contains json-api, mongodb and finance microservice using :
* `cd Docker-compose/`
* `docker-compose up` (exit with _ctrl + c_)  

### Launch the frontend
Visit your app at [http://localhost:4200](http://localhost:4200) using :
* `ember start`

## How it works

### Use the frontend

* There are multiple truck drivers displayed on the interface with fixed city starting city.
* You must pair them with any ending city from the list below (preferably different from the starting city):
  * `Bordeaux`
  * `Lille`
  * `Lyon`
  * `Marseille`
  * `Nantes`
  * `Paris`
  * `Toulouse`
  
* Press the `Pull Data From Server` button. It will get GPS coordinates of the different cities from Google APIs and store them for further calculation.

* Press the `Generate Path using AlgoGen From Server` button. It generate the optimal path for your truck driver to take using our Genetic Algorithm API (G2API).

* Press the `Display Markers` button. It will display the different path your truck drivers will take. Every path has its color to differentiate it from others.

### Genetic Algorithm
Our Genetic Algorithm API (**G2API**) calculate the optimal path to take from one city to another.

You won't have to deal with it directly, but for your information you can use our genetic algorithm API :
* `http://localhost:1337/algogen?start=[city]&end=[city]`

You can use any city from this list for `start` and `end` values.
* `Bordeaux`
* `Lille`
* `Lyon`
* `Marseille`
* `Nantes`
* `Paris`
* `Toulouse` 

### Credits

* `Thierry Gonard : `https://github.com/tuxnut
* `Thomas Le Flohic : `https://github.com/QuarkyUp
* `Aurelien Vernizeau : `https://github.com/Cerclique
