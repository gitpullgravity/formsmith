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
    config: '',
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
    el.addEventListener('change', function() {
      data[schemaItem.key] = this.value;
      smith.change();
    });
    return el;
  }
}
