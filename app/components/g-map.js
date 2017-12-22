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
  selectedTruckList: [],
  returnedPath: null,
  customOptions: computed(function() {
    if (google) {
      return { mapTypeId: google.maps.MapTypeId.ROADMAP};
    }
  }),
  orInit: Ember.on('init', () => {

  }),
  actions: {
    selectTrucks(selectedTrucks) {
      this.set('selectedTruckList', selectedTrucks);
      console.log(this.get('selectedTruckList'));
    },
    pullData() {
      console.log('Pull');

      all(this.get('selectedTruckList').map(city => {
        return Ember.$.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=AIzaSyA8PIvLl5iLB3iCwRdiPLQTFV68Btw_RjY').then(result => result.results[0]);
      })).then((...res) => {
        let locationData = res[0];
        let result = locationData.map(obj => obj.geometry.location);
        this.set('returnedPath', result);
      });
    },
    displayData() {
      console.log('Display');
      console.log(this.get('returnedPath'));
    }
  }
});
