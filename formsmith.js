var sampleschema = [
  {
    type: "Array",
    key: "list",
    schema: [
      {
        type: "Number",
        key: "number"
      }, {
        type: "Textarea",
        key: "text"
      }
    ]
  }, {
    type: "Input",
    key: "input"
  }
]

var config = {
  list: [{ 'number': 1, 'text': 'Hello' }, { 'number': 2 }],
  input: 'hi'
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
            data.map(function(){
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
      el.querySelector('.fs-array-add').addEventListener('click', function() {
        data.push({});
        smith.reform();
      });
      Array.prototype.forEach.call(el.querySelectorAll('.fs-array-delete'), function(x, i) {
        x.addEventListener('click', function() {
          data.splice(i, 1);
          smith.reform();
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
        <input class='fs-number' type='number' value=${ data }>
      `
      return append(element, html)
    }
  },
  "Textarea": {
    defaults: {
      config: "",
      placeholder: "Enter text"
    },
    render: function(element, schemaItem, data) {
      let html = `
        <textarea class='fs-textarea'>${ data }</textarea>
      `
      return append(element, html)
    }
  },
  "Input": {
    defaults: {
      config: "",
      placeholder: "Enter text"
    },
    render: function(element, schemaItem, data) {
      let html = `
        <input class='fs-input' type='text' value='${ data }'>
      `
      return append(element, html)
    }
  },
  "Information": {
    defaults: {
      config: ""
    },
    render: function(element, schemaItem, data) { }
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
  this.buildForm(schema, config, element)
}

FormSmith.prototype.onChange = function(callback, context) {
  callback.apply(context, this.config);
}

FormSmith.prototype.buildForm = function(schema, data, element) {
  var self = this;
  schema.forEach(function(item, i) {
    data[item.key] = fillConfigDefaults(data[item.key], item);
    let newDiv = document.createElement('div');
    newDiv.classList.add('fs-item');
    element.appendChild(newDiv);
    self.buildNode(item, data[item.key], newDiv);
  });
}

FormSmith.prototype.buildNode = function(schemaItem, data, element) {
  var self = this;
  let bus = { reform: function() { this.buildNode(schemaItem, data, element); }.bind(this) };
  // Strangely, the following line did not work. I wonder why?
  // bus.reform.bind(this);

  var el = renderItem(schemaItem, element, data, bus);

  // If the schema contains a schema, we nest and recursively call buildForm
  if (schemaItem.schema) {
    data.forEach(function(dataNode, i) {
      // Each type supporting children is responsible for rendering this
      var elementToRenderInto = el.querySelectorAll('.fs-child')[i]
                                    .querySelector('.fs-child-contents');
      self.buildForm(schemaItem.schema, dataNode, elementToRenderInto);
    });
  }
}

var fs = new FormSmith(sampleschema, config, document.querySelector('#form'));