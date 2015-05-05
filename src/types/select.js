const append = require('../append');

module.exports = {
  defaults: {
    config: []
  },
  render: function(element, schemaItem, data, smith) {
    let html = `
      <select class='fs-select'>
        ${
          data[schemaItem.key].map(function(option){
            return `
              <option value=${ option.value || option.text }>
                ${ option.text }
              </option>
            `;
          }).join('')
        }
      </select>
    `
    let el = append(element, html);
    return el;
  }
}