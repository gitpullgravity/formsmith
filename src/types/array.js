const insert = require('../insert-html');

module.exports = {
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
      let el = insert(element, html);
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
  }