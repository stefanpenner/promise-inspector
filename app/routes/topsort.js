var TopsortRoute = Ember.Route.extend({
  model: function() {
    return this.get('promiseAssembler.topsort');
  }
});

export default TopsortRoute;
