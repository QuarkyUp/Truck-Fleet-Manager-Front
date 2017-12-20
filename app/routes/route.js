import Route from '@ember/routing/route';

export default Route.extend({
  setupController: function(controller) {
    controller.setProperties({
      lat: 47.5,
      lng: 2.33,
      zoom: 9
    });
  }
});

