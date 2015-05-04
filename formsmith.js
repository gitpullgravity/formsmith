var sampleschema = [
  {
    type: "Array",
    key: "list",
    schema: [
      {
        type: "Array",
        key: "listinner",
        schema: [
          {
            type: "Textarea",
            key: "text"
          }
        ]
      }
    ]
  }
]

var config = {

};

var types = {
  "Array": {
    defaults: {
      config: [],
      buttonLabel: "(+) Add Item"
    },
    render: function(element, schemaItem, data, smith) {
      let html = `
        <div class='fs-array'>
          <ul class='fs-children'>
          ${
            data[schemaItem.key].map(function(){
              return `
                <li class='fs-child'>
                  <div class='fs-array-delete'></div>
                  <div class='fs-child-contents'></div>
                </li>`
            }).join('')
          }
          </ul>
          <div class='fs-array-add'>${ schemaItem.buttonLabel }</div>
        </div>
      `;
      let el = append(element, html);
      el.querySelector(':scope > .fs-array-add').addEventListener('click', function() {
        data[schemaItem.key].push({});
        smith.reform();
        smith.change();
      });
      let childDom = el.querySelector('.fs-children');
      let domList = childDom.querySelectorAll(':scope > .fs-child');
      Array.prototype.forEach.call(domList, function(li, i) {
        li.querySelector('.fs-array-delete').addEventListener('click', function() {
          data[schemaItem.key].splice(i, 1);
          smith.reform();
          smith.change();
        });
      });
      return el;
    }
  },
  "Number": {
    defaults: {
      config: 0
    },
    render: function(element, schemaItem, data, smith) {
      let html = `
        <input class='fs-number' type='number' value=${ data[schemaItem.key] }>
      `
      let el = append(element, html);
      el.addEventListener('keyup', function(){
        data[schemaItem.key] = this.value;
        smith.change();
      });
      return el;
    }
  },
  "Textarea": {
    defaults: {
      config: "",
      placeholder: "Enter text"
    },
    render: function(element, schemaItem, data, smith) {
      let html = `
        <textarea class='fs-textarea'>${ data[schemaItem.key] }</textarea>
      `
      let el = append(element, html);
      el.addEventListener('keyup', function(){
        data[schemaItem.key] = this.value;
        smith.change();
      });
      return el;
    }
  },
  "Input": {
    defaults: {
      config: "",
      placeholder: "Enter text"
    },
    render: function(element, schemaItem, data) {
      let html = `
        <input class='fs-input' type='text' value='${ data[schemaItem.key] }'>
      `
      let el = append(element, html);
      el.addEventListener('keyup', function(){
        data[schemaItem.key] = this.value;
        smith.change();
      });
      return el;
    }
  },
  "Information": {
    defaults: {
      config: ""
    },
    render: function(element, schemaItem, data) {
      let html = `
        <div class='fs-info'>${ data[schemaItem.key] }</div>
      `
      return append(element, html);
    }
  }
}

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

// DOMelement + string => DOMElement
function append(element, string) {
  let tempContainer = document.createElement('div');
  tempContainer.innerHTML = string.trim();
  let realElement = tempContainer.firstChild;
  element.appendChild(realElement);
  return realElement;
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
    data[item.key] = fillConfigDefaults(data[item.key], item);
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

var fs = new FormSmith(sampleschema, config, document.querySelector('#form'));
fs.onChange(function(x) { console.log(JSON.stringify(x, null, 2)); });
