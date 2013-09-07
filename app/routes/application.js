import Promise from 'appkit/models/promise';

var ApplicationRoute = Ember.Route.extend({
  setupController: function(){
    this.controllerFor('promises', Promise.all);
  }
});

export default ApplicationRoute;
