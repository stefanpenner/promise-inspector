var StreamRoute = Ember.Route.extend({
  model: function() {
    return this.get('promiseAssembler.events');
  }
});

export default StreamRoute;
