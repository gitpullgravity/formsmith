var FormSmith = require('./src/formsmith');


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
          }, {
            type: "Select",
            key: "select",
            options: [
              {
                "value": 1,
                "text": "one"
              }, {
                "value": 2,
                "text": "two"
              }
            ]
          }
        ]
      }
    ]
  }
];

var config = {};

var fs = new FormSmith(sampleschema, config, document.querySelector('#form'));
fs.onChange(function(x) { console.log(JSON.stringify(x, null, 2)); });
