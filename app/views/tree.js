var d3 = window.d3;
var get = Ember.get;

var TreeView = Ember.View.extend({
  tagName: 'svg',
  duration: 500,
  width: 960,
  height: 500,
  update: function(){
    var svg = get(this, 'svg');
    var nodes = this.nodes;
    var root = this.root;
    var tree = this.get('tree');
    var node = svg.selectAll('.node');
    var link = svg.selectAll('.link');
    var diagonal = this.diagonal;

    // makerandm data
    var n = {id: nodes.length},
        parent = nodes[Math.random() * nodes.length | 0];

    if (parent.children) {
      parent.children.push(n);
    } else {
      parent.children = [n];
    }

    nodes.push(n);

    // update tree
    node = node.data(tree.nodes(root), function(d) { return d.id; });
    link = link.data(tree.links(nodes), function(d) { return d.source.id + '-' + d.target.id; });

    // add stuff that changed
    node.enter().append('circle').
        attr('class', 'node').
        attr('r',  10).
        attr('cx', function(d) { return d.parent.px; }).
        attr('cy', function(d) { return d.parent.py; });

    link.enter().insert('path', '.node')
        .attr('class', 'link')
        .attr('d', function(d) {
          var o = {
            x: d.source.px,
            y: d.source.py
          };

          return diagonal({
            source: o,
            target: o
          });
        });

    var transition = svg.transition().duration(this.duration);

    transition.selectAll('.link').attr('d', diagonal);

    transition.selectAll('.node').
        attr('cx', function(d) { return d.px = d.x; }).
        attr('cy', function(d) { return d.py = d.y; });
  },

  dataDidChange:function(){
    Ember.run.scheduleOnce('render', this, 'update');
  }.observes('data'),

  init: function(){
    this.root = {};

    this.root.parent = this.root;
    this.root.px = this.root.x;
    this.root.py = this.root.y;

    this.nodes = this.get('tree')(this.root);
    this.diagonal = d3.svg.diagonal();

    this._super();
  },

  tree: Ember.computed(function(){
    var width = this.get('width');
    var height = this.get('height');
    var tree = d3.layout.tree().size([width - 30, height - 30 ]);

    return tree;
  }),

  svg: Ember.computed(function(){
    var element = get(this, 'element');
    return d3.select(element);
  }),

  didInsertElement: function(){
    var width = this.get('width');
    var height = this.get('height');

    var tree = this.get('tree');
    var root = this.root;

    var svg = this.get('svg').
        attr('width', width).
        attr('height', height).
        append('g');

    var node = svg.selectAll('.node'),
        link = svg.selectAll('.link');


    // once in dom simulate data changing
    this.interval = window.setInterval(update, this.duration);
    var view = this;
    function update() {
      Ember.run(view, 'dataDidChange');
    }
  },

  willDestroyElement: function(){
    window.clearInterval(this.interval);
}
});

export default TreeView;
