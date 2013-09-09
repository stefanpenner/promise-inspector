var get = Ember.get;
var d3 = window.d3;

var node1 = {},
    node2 = {},
    node3 = {}, node4 = {};

var nodes = [node1, node2, node3];

function tick(link, node) {
  link.
    attr('x1', function(d) { return d.source.x; }).
    attr('y1', function(d) { return d.source.y; }).
    attr('x2', function(d) { return d.target.x; }).
    attr('y2', function(d) { return d.target.y; });

  node.
    attr('cx', function(d) { return d.x; }).
    attr('cy', function(d) { return d.y; });
}

function mousedown() {
  var current = d3.select(this);
  var selected = d3.select('.node.selected');

  if (current.classed('selected')) {
    current.classed('selected', false);
  } else {
    selected.classed('selected', false);
    current.classed('selected', true);
  }
}

var Component = Ember.Component.extend({
  tagName: 'svg',
  width: 800,
  height: 800,
  force: function(){
    var width = get(this, 'width');
    var height = get(this, 'height');

    var nodes = get(this, 'nodes');
    var links = get(this, 'links');

    var force = d3.layout.force().
      size([width, height]).
      linkDistance(30).
      links(links).
      nodes(nodes).
      charge(-50);

    return force;
  }.property().readOnly(),

  dataDidChange: function(){
    Ember.run.scheduleOnce('afterRender', this, 'updateData');
  }.observes('nodes.[]', 'links.[]'),

  didInsertElement: function(){
    var width = get(this, 'width');
    var height = get(this, 'height');

    var svg = d3.select(this.$()[0]).
      attr('width', width).
      attr('height', height);

    var force = get(this, 'force');

    force.on('tick', function(){
      var node = svg.selectAll('.node');
      var link = svg.selectAll('.link');
      tick(link, node);
    });

    svg.append('rect').
      attr('width', width).
      attr('height', height);

    this.updateData();
  },

  nodes: function(){
    nodes.push({});
    return nodes;
  }.property().volatile(),

  links: function(){
    //return [{
    //  source: node1,
    //  target: node2
    //}];
    return [];
  }.property(),

  updateData: function() {
    var force = get(this, 'force');

    var nodes = get(this, 'nodes');
    var links = get(this, 'links');

    var svg = d3.select(this.$()[0]);

    var node = svg.selectAll('.node');
    var link = svg.selectAll('.link');

    link = link.data(links);
    node = node.data(nodes);

    link.enter().
      insert('line').
      classed('link', true).
      attr("stroke-width", "5").
        attr("marker-end", "url(#triangle)");

    node.enter().
      append('circle').
      attr("class", function(data) { return data.get('guid'); }).
      classed('node', true).
      attr('r', 5).
      on('mousedown', mousedown).call(force.drag);

    console.log("updateData");
    force.start();
  }
// {{promise-force links=links nodes=promise}}
});


export default Component;
