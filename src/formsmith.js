const types = require('./types')


// schema + element + object => element
function renderItem(schemaItem, element, data, bus) {
  element.innerHTML = '';
  var defaults = types[schemaItem.type].defaults;
  Object.assign(schemaItem, defaults);
  return types[schemaItem.type].render(element, schemaItem, data, bus);
}

// object + schema => object
function fillConfigDefaults(data, schemaItem) {
  return data || types[schemaItem.type].defaults.config;
}

// Returns an object not by reference
// object => object
function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function FormSmith(schema, config, element) {
  this.schema = schema;
  this.config = config;
  this.element = element;
  this.changeCallbacks = [];
  this.buildForm(schema, config, element)
}

FormSmith.prototype.onChange = function(callback, context) {
  this.changeCallbacks.push({ cb: callback, ctx: context });
}

FormSmith.prototype.handleChange = function() {
  var self = this;
  self.changeCallbacks.forEach(function(callbackObj) {
    callbackObj.cb.call(callbackObj.context, self.config);
  });
}

FormSmith.prototype.buildForm = function(schema, data, element) {
  var self = this;
  schema.forEach(function(item, i) {
    var defaultConfig = types[item.type].defaults.config;
    data[item.key] = data[item.key] || clone(defaultConfig);
    let newDiv = document.createElement('div');
    newDiv.classList.add('fs-item');
    element.appendChild(newDiv);
    self.buildNode(item, data, newDiv);
  });
}

FormSmith.prototype.buildNode = function(schemaItem, data, element) {
  var self = this;
  let bus = {
    reform: function() { self.buildNode(schemaItem, data, element); }.bind(self),
    change: self.handleChange.bind(self)
  };
  // Strangely, the following line did not work. I wonder why?
  // bus.reform.bind(this);

  var el = renderItem(schemaItem, element, data, bus);

  // If the schema contains a schema, we nest and recursively call buildForm
  if (schemaItem.schema) {
    data[schemaItem.key].forEach(function(dataNode, i) {
      // Each type supporting children is responsible for rendering this
      var elementToRenderInto = el.querySelector('.fs-children')
                                    .querySelectorAll(':scope > .fs-child')[i]
                                      .querySelector('.fs-child-contents');
      self.buildForm(schemaItem.schema, dataNode, elementToRenderInto);
    });
  }
}

module.exports = FormSmith;
