import Resolver from 'resolver';

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Resolver: Resolver,
  ready: function() {
    var InstrumentedRSVP = requireModule('rsvp');
    var controller = this.__container__.lookup('controller:promises');

    function pushObject(event) {
      Ember.run.join(function(){
        controller.pushObject(event);
      });
    }

    InstrumentedRSVP.Promise.on('created',   pushObject);
    InstrumentedRSVP.Promise.on('fulfilled', pushObject);
    InstrumentedRSVP.Promise.on('rejected',  pushObject);
    InstrumentedRSVP.Promise.on('chained',   pushObject);

    setTimeout(function(){
      InstrumentedRSVP.resolve('fulfillment value').then();
      InstrumentedRSVP.reject(new Error('rejection reason')).then();
    });
  }
});

import AssemblePromises from 'appkit/lib/promise_assembler';
App.then(AssemblePromises);

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router
export default App;
