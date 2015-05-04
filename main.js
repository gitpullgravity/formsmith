var FormSmith = require('./dist/formsmith');


var sampleschema = [
  {
    type: "Array",
    key: "list",
    schema: [
      {
        type: "Array",
        key: "listinner",
        schema: [
          {
            type: "Textarea",
            key: "text"
          }
        ]
      }
    ]
  }
];

var config = {};

var fs = new FormSmith(sampleschema, config, document.querySelector('#form'));
fs.onChange(function(x) { console.log(JSON.stringify(x, null, 2)); });
