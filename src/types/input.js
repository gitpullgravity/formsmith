const append = require('../append');

module.exports = {
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
}