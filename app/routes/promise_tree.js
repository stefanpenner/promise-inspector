var PromiseTreeRoute = Ember.Route.extend({

  model: function() {
    return this.get('promiseAssembler').find();
  }
});

export default PromiseTreeRoute;
