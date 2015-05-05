const insert = require('../insert-html');

module.exports = {
  defaults: {
    config: "",
    placeholder: "Enter text"
  },
  render: function(element, schemaItem, data, smith) {
    let html = `
      <textarea class='fs-textarea'>${ data[schemaItem.key] }</textarea>
    `
    let el = insert(element, html);
    el.addEventListener('keyup', function(){
      data[schemaItem.key] = this.value;
      smith.change();
    });
    return el;
  }
}