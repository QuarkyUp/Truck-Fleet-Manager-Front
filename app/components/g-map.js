import { all } from 'rsvp';
import Component from '@ember/component';
import Ember from 'ember'
const { computed } = Ember;


export default Component.extend({
  lat: 47.5,
  lng: 2.33,
  zoom: 9,
  buttonState: "default",
  truckList: ['Paris', 'Lille', 'Lyon', 'Bordeaux', 'Brest', 'Strasbourg', 'Toulouse', 'Strasbourg'],
  destinationList: ['Paris', 'Lille', 'Lyon', 'Bordeaux', 'Brest', 'Strasbourg', 'Toulouse', 'Strasbourg'],
  selectedTruckList: [],
  selectedDestination: [],
  returnedPath: [],
  originTruckList: null,
  destination_Juan: '',
  oroginTruckListFake: [
    {
      Name:'David',
      City:'Paris',
      lat: 48.864716,
      lng: 2.349014
    },
    {
      Name:'Juan',
      City:'Brest',
      lat: 52.097622,
      lng: 23.734051
    },
    {
      Name:'Robert',
      City:'Bordeaux',
      lat: 44.836151,
      lng: -0.580816
    },
  ],
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
    selectDestination(selectedDestination) {
      this.set('selectedDestination', selectedDestination);
      console.log(this.get('selectedDestination'));
    },
    selectTrucks(selectedTrucks) {
      this.set('selectedTruckList', selectedTrucks);
      console.log(this.get('selectedTruckList'));
    },
    pullTruckStartPosition() {
      console.log('Pull');
      if (this.get('selectedDestination').length == 0) {
        window.alert('Please select a destination');
        return;
      }
      all(this.get('selectedDestination').map(city => {
        return Ember.$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=AIzaSyA8PIvLl5iLB3iCwRdiPLQTFV68Btw_RjY').then(result => result.results[0]);
      })).then((...res) => {
        let locationData = res[0];
        let result = locationData.map(obj => obj.geometry.location);
        this.set('returnedPath', result);
      });
    },
    displayTruckPathOnMap() {
      console.log('Display');
      console.log(this.get('returnedPath'));

    },
    destWritten() {
      console.log(this.get('destination_Juan'));
      console.log('test');

    }
  }
});
