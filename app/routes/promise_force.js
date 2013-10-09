var PromiseForceRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.get('promiseAssembler').find());
    controller.set('edges', this.get('promiseAssembler.edges'));
  }
});

export default PromiseForceRoute;

