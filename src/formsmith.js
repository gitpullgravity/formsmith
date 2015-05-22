let types = require('./types')
const assign = Object.assign || require('object.assign');


// schema + element + object => element
function renderItem(schemaItem, element, data, bus) {
  element.innerHTML = '';
  let defaults = types[schemaItem.type].defaults;
  let filledSchema = assign({}, defaults, schemaItem);
  return types[filledSchema.type].render(element, filledSchema, data, bus);
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

class FormSmith {

  constructor(schema, config, element, options = {}) {
    this.schema = schema;
    this.config = config;
    this.element = element;
    this.changeCallbacks = [];
    if (options.plugins) {
      for (let pluginName in options.plugins) {
        this.registerFormItemType(pluginName, options.plugins[pluginName]);
      }
    }
    this.buildForm(schema, config, element)
  }

  onChange(callback, context) {
    this.changeCallbacks.push({ cb: callback, ctx: context });
  }

  handleChange() {
    let self = this;
    self.changeCallbacks.forEach(function(callbackObj) {
      callbackObj.cb.call(callbackObj.context, self.config);
    });
  }

  buildForm(schema, data, element) {
    let self = this;
    schema.forEach(function(item, i) {
      let defaults = types[item.type].defaults || {};
      let defaultConfig = defaults.config || {};
      data[item.key] = data[item.key] || clone(defaultConfig);
      let newDiv = document.createElement('div');
      newDiv.classList.add('fs-item');
      element.appendChild(newDiv);
      self.buildNode(item, data, newDiv);
    });
  }

  buildNode(schemaItem, data, element) {
    let self = this;
    let bus = {
      reform: function() { self.buildNode(schemaItem, data, element); }.bind(self),
      change: self.handleChange.bind(self)
    };
    // Strangely, the following line did not work. I wonder why?
    // bus.reform.bind(this);

    let el = renderItem(schemaItem, element, data, bus);

    // If the schema contains a schema, we nest and recursively call buildForm
    if (schemaItem.schema) {
      data[schemaItem.key].forEach(function(dataNode, i) {
        // Each type supporting children is responsible for rendering this
        let elementToRenderInto = el.querySelector('.fs-children')
                                      .querySelectorAll(':scope > .fs-child')[i]
                                        .querySelector('.fs-child-contents');
        self.buildForm(schemaItem.schema, dataNode, elementToRenderInto);
      });
    }
  }

  registerFormItemType(typeName, type) {
    types[typeName] = type;
  }

}

module.exports = FormSmith;
