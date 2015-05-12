const insert = require('../insert-html');

module.exports = {
  defaults: {
    config: "",
    placeholder: "Enter text",
    label: ""
  },
  render: function(element, schemaItem, data, smith) {
    let html = `
      <div class='fs-input-container'>
        <span class='fs-input-label'>${ schemaItem.label }</span>
        <span class='fs-input-wrapper'>
          <input class='fs-input' 
                 type='text'
                 value='${ data[schemaItem.key] }'
                 placeholder='${ schemaItem.placeholder }'>
        </span>
      </div>
    `
    let el = insert(element, html);
    el.querySelector('input').addEventListener('keyup', function(){
      data[schemaItem.key] = this.value;
      smith.change();
    });
    return el;
  }
}