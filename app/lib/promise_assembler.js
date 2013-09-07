export default assembler;
import InstrumentedRSVP from 'rsvp';
import Promise from 'appkit/models/promise';

window.InstrumentedRSVP = InstrumentedRSVP;

InstrumentedRSVP.configure('async', function(callback, promise) {
  Ember.run(promise, callback, promise);
});

function assembler(app) {
  var events = app.__container__.lookup('controller:events');

  function resolve(event) {
    var guid = event.guid || event.parent;
    var promise = Promise.updateOrCreate(guid, event);

    Promise.all.pushObject(promise);

    var state = promise.get('state');
    promise.set('state', event.eventName);

    Ember.run.join(events, 'pushObject', event);
  }

  function chain(event) {
    var guid = event.guid || event.parent;
    var promise = Promise.updateOrCreate(guid, event);
    Promise.all.pushObject(promise);

    var children = promise.get('children') || Ember.A();
    children.push(event.child);
    promise.set('children', children);

    Ember.run.join(events, 'pushObject', event);
  }

  function create(event) {
    Ember.run.join(function(){
      var guid = event.guid;
      var promise = Promise.updateOrCreate(guid, event);

      // todo fix ordering
      if (Ember.isNone(promise.get('state'))) {
        promise.set('state', 'created');
      }

      Promise.all.pushObject(promise);
      Ember.run.join(events, 'pushObject', event);
    });
  }

  // listen for stuff
  InstrumentedRSVP.Promise.on('chained',   chain);
  InstrumentedRSVP.Promise.on('rejected',  resolve);
  InstrumentedRSVP.Promise.on('fulfilled', resolve);
  InstrumentedRSVP.Promise.on('created',   create);

  // simulate some stuff
  Ember.run.later(function(){
    InstrumentedRSVP.Promise(function(){});
    InstrumentedRSVP.resolve('fulfillment value').then();
    InstrumentedRSVP.reject(new Error('rejection reason')).then();
    InstrumentedRSVP.Promise(function(){});
  }, 1000);
}
