var IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('promise_tree');
  }
});
export default IndexRoute;
