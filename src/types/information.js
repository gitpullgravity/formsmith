const insert = require('../insert-html');

module.exports = {
  defaults: {
    config: ""
  },
  render: function(element, schemaItem, data) {
    let html = `
      <div class='fs-info'>${ data[schemaItem.key] }</div>
    `
    return insert(element, html);
  }
}