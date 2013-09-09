var get = Ember.get;
import Promise from 'appkit/models/promise';
var EventsController = Ember.ArrayController.extend({
  topsort: Ember.computed(function(){
    return [];
  }),

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

      Promise.addEdge(entry);
      dag.addEdge(guid, parent);
    });

    var topsort = [];

    dag.topsort(function(vertex, path){
      topsort.push(Promise.find(vertex.name));
    });

    var oldTopsort  = this.get('topsort');

    oldTopsort.replace(0, oldTopsort.get('length'), topsort);
  },

  contentDidChange: function(){
    Ember.run.once(this, 'updateTopSort');
  }.observes('content.[]').on('didInit')
});

export default EventsController;
