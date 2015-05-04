const append = require('./append');

module.exports = {
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
            data[schemaItem.key].map(function(){
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
      el.querySelector(':scope > .fs-array-add').addEventListener('click', function() {
        data[schemaItem.key].push({});
        smith.reform();
        smith.change();
      });
      let childDom = el.querySelector('.fs-children');
      let domList = childDom.querySelectorAll(':scope > .fs-child');
      Array.prototype.forEach.call(domList, function(li, i) {
        li.querySelector('.fs-array-delete').addEventListener('click', function() {
          data[schemaItem.key].splice(i, 1);
          smith.reform();
          smith.change();
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
        <input class='fs-number' type='number' value=${ data[schemaItem.key] }>
      `
      let el = append(element, html);
      el.addEventListener('keyup', function(){
        data[schemaItem.key] = this.value;
        smith.change();
      });
      return el;
    }
  },
  "Textarea": {
    defaults: {
      config: "",
      placeholder: "Enter text"
    },
    render: function(element, schemaItem, data, smith) {
      let html = `
        <textarea class='fs-textarea'>${ data[schemaItem.key] }</textarea>
      `
      let el = append(element, html);
      el.addEventListener('keyup', function(){
        data[schemaItem.key] = this.value;
        smith.change();
      });
      return el;
    }
  },
  "Input": {
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
  },
  "Information": {
    defaults: {
      config: ""
    },
    render: function(element, schemaItem, data) {
      let html = `
        <div class='fs-info'>${ data[schemaItem.key] }</div>
      `
      return append(element, html);
    }
  }
}