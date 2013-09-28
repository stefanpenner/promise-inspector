var promises = Ember.A();
var edges= Ember.A();

var Promise = Ember.Object.extend({

  parent: null,

  level: function() {
    var parent = this.get('parent');
    if (!parent) {
      return 0;
    }
    return parent.get('level') + 1;
  }.property('parent')

});

Promise.reopenClass({
  all: promises,
  edges: edges,

  addEdge: function(event) {
    var source = Promise.findOrCreate(event.parent);
    var target = Promise.findOrCreate(event.child);

    edges.push({
      source: source,
      target: target
    });
  },

  find: function(guid){
    return promises.findProperty('guid', guid);
  },

  findOrCreate: function(guid) {
    return promises.findProperty('guid', guid) || Promise.create({
      guid: guid
    });
  },
  updateOrCreate: function(guid, properties){
    // console.log('updateOrCreate', guid, properties);
    var entry = Promise.find(guid);

    if (entry) {
      entry.setProperties(properties);
    } else {
      entry = Promise.create(properties);
    }

    return entry;
  }
});

export default Promise;
