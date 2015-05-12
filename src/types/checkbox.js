const insert = require('../insert-html');

module.exports = {
  defaults: {
    config: "",
    checked: false,
    label: ""
  },
  render: function(element, schemaItem, data, smith) {
    let html = `
      <div class='fs-checkbox-container'>
        <input class='fs-checkbox' 
               type='checkbox'
               ${ (schemaItem.checked) ? "checked" : "" }>
        <span class='fs-checkbox-label'>${ schemaItem.label }</span>
      </div>
    `
    let el = insert(element, html);
    el.querySelector('input').addEventListener('change', function(){
      data[schemaItem.key] = this.checked;
      smith.change();
    });
    return el;
  }
}