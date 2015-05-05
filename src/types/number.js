const insert = require('../insert-html');

module.exports = {
  defaults: {
    config: 0
  },
  render: function(element, schemaItem, data, smith) {
    let html = `
      <input class='fs-number' type='number' value=${ data[schemaItem.key] }>
    `
    let el = insert(element, html);
    el.addEventListener('keyup', function(){
      data[schemaItem.key] = this.value;
      smith.change();
    });
    return el;
  }
}