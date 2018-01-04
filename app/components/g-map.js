import { all } from 'rsvp';
import Component from '@ember/component';
import Ember from 'ember'
const { computed } = Ember;


export default Component.extend({
  gMap: Ember.inject.service(),
  lat: 47.5,
  lng: 2.33,
  zoom: 9,
  buttonState: "default",
  truckList: ['Paris', 'Lille', 'Lyon', 'Bordeaux', 'Brest', 'Strasbourg', 'Toulouse', 'Strasbourg'],
  destinationList: ['Paris', 'Lille', 'Lyon', 'Bordeaux', 'Brest', 'Strasbourg', 'Toulouse', 'Strasbourg'],
  selectedTruckList: [],
  selectedDestination: [],
  returnedPath: [],
  generatedPath:[],
  originTruckList: null,
  destination_Juan: '',
  destination_David: '',
  destination_Robert: '',
  originTruckListFake: [
    {
      Name:'David',
      City:'Paris',
      lat: 48.864716,
      lng: 2.349014
    },
    {
      Name:'Juan',
      City:'Toulouse',
      lat: 43.6022,
      lng: 1.4440
    },
    {
      Name:'Robert',
      City:'Bordeaux',
      lat: 44.836151,
      lng: -0.580816
    },
  ],
  mapMarkers: null,
  mapPolyLines: null,
  gpsPathFinal: [],
  customOptions: computed(function() {
    if (google) {
      return { mapTypeId: google.maps.MapTypeId.ROADMAP};
    }
  }),
  init() {
    this._super(...arguments);
    Ember.$.getJSON('http://localhost:1337/kiwi').then(result => {
      this.set('originTruckList', result);
      console.log(this.get('originTruckList'));
    });
  }
  ,
  actions: {
    // selectDestination(selectedDestination) {
    //   this.set('selectedDestination', selectedDestination);
    //   console.log(this.get('selectedDestination'));
    // },
    // selectTrucks(selectedTrucks) {
    //   this.set('selectedTruckList', selectedTrucks);
    //   console.log(this.get('selectedTruckList'));
    // },
    pullTruckStartPosition() {
      console.log('Pull');
      console.log(this.get('selectedDestination'));
      all(this.get('selectedDestination').map(city => {
        return Ember.$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=AIzaSyA8PIvLl5iLB3iCwRdiPLQTFV68Btw_RjY').then(result => result.results[0]);
      })).then((...res) => {
        let locationData = res[0];
        let result = locationData.map(obj => obj.geometry.location);
        this.set('returnedPath', result);
        console.log(this.get('returnedPath'));
        let finalMov = [
          {
            destination: { lat: result[1].lat, lng: result[1].lng },
            origin: { lat: this.get('originTruckListFake')[0].lat, lng: this.get('originTruckListFake')[0].lng }
          },
          {
            destination: { lat: result[0].lat, lng: result[0].lng },
            origin: { lat: this.get('originTruckListFake')[1].lat, lng: this.get('originTruckListFake')[1].lng }
          },
          {
            destination: { lat: result[2].lat, lng: result[2].lng },
            origin: { lat: this.get('originTruckListFake')[2].lat, lng: this.get('originTruckListFake')[2].lng }
          }
        ];
        console.log(finalMov);
        this.set('finalPath', finalMov);
      });

    },
    displayTruckPathOnMap() {
      console.log('Display');
      console.log(this.get('returnedPath'));

    },
    destWritten() {
      let destArray = [this.get('destination_Juan'), this.get('destination_David'), this.get('destination_Robert')];
      this.set('selectedDestination', destArray);
    },
    displayMarkers() {
      // this.set('mapMarkers', Ember.A([
      //   {
      //     id: 'unique-marker-id',  // Recommended
      //     lat: 33.516674497188255, // Required
      //     lng: -86.80091857910156, // Required
      //     infoWindow: {
      //       content: '<p>Birmingham</p>',
      //       visible: true
      //     }
      //   },
      //   {
      //     id: 'unique-marker-id2',  // Recommended
      //     lat: 10.516674497188255, // Required
      //     lng: 10.80091857910156, // Required
      //     infoWindow: {
      //       content: '<p>Birmingham</p>',
      //       visible: true
      //     }
      //   }
      // ]));



      console.log(this.get('gpsPathFinal'));

      let fin = [];

      this.get('gpsPathFinal').forEach(item => {
        let out = item.map(function(obj) {
          return Object.keys(obj).sort().map(function(key) {
            return obj[key];
          });
        });
        // console.log(out);
        fin.push(out);
      });

      console.log('after');
      console.log(fin[0]);

      this.set('mapPolyLines', Ember.A([
        {
          id: 'unique-marker-id',  // Recommended
          path: fin[0],
          geodesic: true,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW // BACKWARD_CLOSED_ARROW | BACKWARD_OPEN_ARROW | CIRLCE | FORWARD_OPEN_ARROW
            },
            offset: '100%'
          }],
          strokeColor: 'blue',
          strokeOpacity: 0.7,
          strokeWeight: 3,
          visible: true,
          zIndex: 999
        },
        {
          id: 'unique-marker-id2',  // Recommended
          path: fin[1],
          geodesic: true,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW // BACKWARD_CLOSED_ARROW | BACKWARD_OPEN_ARROW | CIRLCE | FORWARD_OPEN_ARROW
            },
            offset: '100%'
          }],
          strokeColor: 'red',
          strokeOpacity: 0.7,
          strokeWeight: 3,
          visible: true,
          zIndex: 999
        },
        {
          id: 'unique-marker-id3',  // Recommended
          path: fin[2],
          geodesic: true,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW // BACKWARD_CLOSED_ARROW | BACKWARD_OPEN_ARROW | CIRLCE | FORWARD_OPEN_ARROW
            },
            offset: '100%'
          }],
          strokeColor: 'green',
          strokeOpacity: 0.7,
          strokeWeight: 3,
          visible: true,
          zIndex: 999
        }
      ]));

      this.get('gMap').maps.refresh('my-map');

    },
    generatePath() {
      let bfPath = [
        {
          destination: this.get('destination_David'),
          origin: this.get('originTruckListFake')[0].City
        },
        {
          destination: this.get('destination_Juan'),
          origin: this.get('originTruckListFake')[1].City
        },
        {
          destination: this.get('destination_Robert'),
          origin: this.get('originTruckListFake')[2].City
        }
      ];

      const afPath = [];
      const gpsPath = [];

      bfPath.forEach(item => {
        Ember.$.getJSON('http://localhost:1337/algoGen?start='+ item.origin + '&end=' + item.destination).then(result => {
          afPath.push(result.path);
          if (afPath.length === 3) {
            afPath.forEach(item =>{
              all(item.map(city => {
                return Ember.$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=AIzaSyA8PIvLl5iLB3iCwRdiPLQTFV68Btw_RjY').then(result => result.results[0]);
              })).then((...res) => {
                let locationData = res[0];
                let result = locationData.map(obj => obj.geometry.location);
                // console.log(result);
                gpsPath.push(result);
                this.get('gpsPathFinal').push(result);
              });
            });
          }
        });
      });
    }
  }
});
