import Resolver from 'resolver';
import InstrumentedRSVP from 'rsvp';
import PromiseAssembler from 'appkit/lib/promise_assembler';
import routes from 'appkit/routes';


var App = Ember.Application.create({
  // LOG_ACTIVE_GENERATION: true,
  // LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Resolver: Resolver
});


App.Router.map(routes); // TODO: just resolve the router

App.initializer({
  name: "promiseAssembler",

  initialize: function(container, app) {
    container.register('promiseAssembler:main', PromiseAssembler);
    var promiseAssembler = container.lookup('promiseAssembler:main');
    promiseAssembler.set('RSVP', InstrumentedRSVP);
    // start assembling promises
    promiseAssembler.start();
    container.typeInjection('controller', 'promiseAssembler', 'promiseAssembler:main');
    container.typeInjection('route', 'promiseAssembler', 'promiseAssembler:main');
  }

});


InstrumentedRSVP.configure('async', function(callback, promise) {
  Ember.run(promise, callback, promise);
});



// Simulate some promises
App.then(function() {
  simulatePromises();
});


function simulatePromises() {
  var RSVP = InstrumentedRSVP;
  var Promise = RSVP.Promise;

  Ember.run.later(fakePromises, 1000);
  // Ember.run.later(fakePromises, 10000);

  function fakePromises() {
    var findPromise = new Promise(function(resolve){
      Em.run.later(function() {
        resolve('<User:20>');
      }, 3000);
    }, "Finding User with id = 20");

    findPromise.then(function() {
      return true;
    });

    Ember.run.later(function() {
      RSVP.resolve('fulfillment value');
    }, 2000);

    Ember.run.later(function() {
      RSVP.reject(new Error('rejection reason'));
    }, 1000);

    Ember.run.later(function() {
      new Promise(function(resolve, reject){

      }, "Saving <Post:111>").then(function() {

      });
    }, 5000);

  }
}



export default App;
