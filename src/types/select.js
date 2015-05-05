/*
  // Example:

  {
    type: "Select",
    key: "select",
    options: [
      {
        "value": 1,
        "text": "one"
      }, {
        "value": 2,
        "text": "two"
      }
    ]
  }

*/



const insert = require('../insert-html');

module.exports = {
  defaults: {
    config: null,
    options: []
  },
  render: function(element, schemaItem, data, smith) {
    let html = `
      <select class='fs-select'>
        ${
          schemaItem.options.map(function(option){
            return `
              <option value=${ option.value || option.text }>
                ${ option.text }
              </option>
            `;
          }).join('')
        }
      </select>
    `
    let el = insert(element, html);
    let selectedValue = data[schemaItem.key];
    el.value = selectedValue ? selectedValue : schemaItem.options[0].value;
    el.addEventListener('change', function() {
      data[schemaItem.key] = this.value;
      smith.change();
    });
    return el;
  }
}
