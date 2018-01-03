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
    }
  }
});
