import Promise from 'appkit/models/promise';

var ApplicationRoute = Ember.Route.extend({
  setupController: function(){
    this.controllerFor('promises').set('content', Promise.all);
    this.controllerFor('promises').set('edges', Promise.edges);
  }
});

export default ApplicationRoute;
