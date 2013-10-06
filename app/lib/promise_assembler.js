import Promise from 'appkit/models/promise';

var get = Ember.get;


var PromiseAssembler = Ember.Object.extend({
  // RSVP lib to debug
  RSVP: null,

  all: function() { return []; }.property(),

  events: function() { return []; }.property(),

  edges: function() { return []; }.property(),

  start: function() {
    var InstrumentedPromise = this.RSVP.Promise;
    // listen for stuff
    InstrumentedPromise.on('chained',   chain.bind(this));
    InstrumentedPromise.on('rejected',  resolve.bind(this));
    InstrumentedPromise.on('fulfilled', resolve.bind(this));
    InstrumentedPromise.on('created',   create.bind(this));
  },

  createPromise: function(props) {
    var promise = Promise.create(props);
    this.get('all').pushObject(promise);
    return promise;
  },

  find: function(guid){
    if (guid) {
      return this.get('all').findProperty('guid', guid);
    } else {
      return this.get('all');
    }

  },

  findOrCreate: function(guid) {
    return this.find(guid) || this.createPromise({
      guid: guid
    });
  },

  updateOrCreate: function(guid, properties){
    var entry = this.find(guid);

    if (entry) {
      entry.setProperties(properties);
    } else {
      entry = this.createPromise(properties);
    }
    entry.set('guid', guid);

    return entry;
  },

  addEdge: function(event) {
    var source = this.findOrCreate(event.parent);
    var target = this.findOrCreate(event.child);

    this.get('edges').push({
      source: source,
      target: target
    });
  },

  topsort: function() {
    return [];
  }.property(),

  updateTopSort: function(){
    var dag = new Ember.DAG(), self = this;

    this.get('events').forEach(function(entry){
      var event = get(entry, 'eventName');
      var guid = get(entry, 'guid');

      if (event === "created") {
        dag.map(guid, entry);
      }
    });

    this.get('events').forEach(function(entry){
      var event = get(entry, 'eventName');
      if (event !== "chained") { return; }
      var guid = get(entry, 'guid');
      var parent = get(entry, 'parent');

      self.addEdge(entry);
      dag.addEdge(guid, parent);
    });

    var topsort = [];

    dag.topsort(function(vertex, path){
      topsort.push(self.find(vertex.name));
    });

    var oldTopsort  = this.get('topsort');

    oldTopsort.replace(0, oldTopsort.get('length'), topsort);
  },

  contentDidChange: function(){
    Ember.run.once(this, 'updateTopSort');
  }.observes('events.[]')
});


function resolve(event) {
  var guid = event.guid || event.parent;
  var promise = this.updateOrCreate(guid, event);

  var state = promise.get('state');
  promise.set('state', event.eventName);

  Ember.run.join(this.get('events'), 'pushObject', event);
}

function chain(originalEvent) {
  var event = Ember.$.extend({}, originalEvent);

  var guid = event.guid || event.parent;

  delete event.parent;

  var promise = this.updateOrCreate(guid, event);


  var children = promise.get('children') || Ember.A();
  var child = this.findOrCreate(event.child);

  child.set('parent', promise);
  children.pushObject(child);
  promise.set('children', children);

  Ember.run.join(this.get('events'), 'pushObject', originalEvent);
}

function create(event) {
  var self = this;
  Ember.run.join(function(){
    var guid = event.guid;

    var promise = self.updateOrCreate(guid, event);

    // todo fix ordering
    if (Ember.isNone(promise.get('state'))) {
      promise.set('state', 'created');
    }

    Ember.run.join(self.get('events'), 'pushObject', event);
  });
}



export default PromiseAssembler;
