import Promise from 'appkit/models/promise';

var PromiseTreeRoute = Ember.Route.extend({

  model: function() {
    return Promise.all;
  }
});

export default PromiseTreeRoute;
