var promises = Ember.A();

var Promise = Ember.Object.extend({
});

Promise.reopenClass({
  all: promises,
  find: function(guid){
    return promises.findProperty('guid', guid);
  },
  updateOrCreate: function(guid, properties){
    console.log('updateOrCreate', guid, properties);
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
