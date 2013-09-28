var PromiseNodeController = Ember.ObjectController.extend({
  style: function() {
    return 'padding-left: ' + ((+this.get('level') * 10) + 5) + "px";
  }.property('level'),

  settledValue: function() {
    if (this.get('state') === 'fulfilled') {
      return inspect(this.get('value'));
    } else if (this.get('state') === 'rejected') {
      return inspect(this.get('reason'));
    }

  }.property('value')

});

function inspect(value) {
  if (typeof value === 'function') {
    return "function() { ... }";
  } else if (value instanceof Ember.Object) {
    return value.toString();
  } else if (Ember.typeOf(value) === 'array') {
    if (value.length === 0) { return '[]'; }
    else if (value.length === 1) { return '[ ' + inspect(value[0]) + ' ]'; }
    else { return '[ ' + inspect(value[0]) + ', ... ]'; }
  } else if(value instanceof Error) {
    return value.message;
  } else {
    return Ember.inspect(value);
  }
}

export default PromiseNodeController;
