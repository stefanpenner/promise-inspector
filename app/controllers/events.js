var get = Ember.get;
import Promise from 'appkit/models/promise';
var EventsController = Ember.ArrayController.extend({
  topsort: null,
  updateTopSort: function(){
    var dag = new Ember.DAG();

    this.forEach(function(entry){
      var event = get(entry, 'eventName');
      var guid = get(entry, 'guid');

      if (event === "created") {
        dag.map(guid, entry);
      }
    });

    this.forEach(function(entry){
      var event = get(entry, 'eventName');
      if (event !== "chained") { return; } 
      var guid = get(entry, 'guid');
      var parent = get(entry, 'parent');

      dag.addEdge(guid, parent);
    });

    var topsort = [];

    dag.topsort(function(vertex, path){
      topsort.push(Promise.find(vertex.name));
    });

    this.set('topsort', topsort);
  },

  contentDidChange: function(){
    Ember.run.once(this, 'updateTopSort');
  }.observes('content.[]').on('didInit')
});

export default EventsController;
