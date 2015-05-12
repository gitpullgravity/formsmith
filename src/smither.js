var FormSmith = require('./formsmith');


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


function makeForm(schema) {
	if (!schema) return;
	var config = {};
	var el = document.querySelector('#form');
	el.innerHTML = "";
	var fs = new FormSmith(schema, config, el);
	fs.onChange(function(x) { console.log(JSON.stringify(x, null, 2)); });
}

function getEditorJSON(editor) {
	try {
		return JSON.parse(editor.getText());
	}
	catch(e) {
		document.querySelector('#form').innerHTML = "Your schema json is invalid";
	}
}

// create the editor 
var editor = new JSONEditor(document.querySelector("#jsoneditor"));
editor.setMode('code');
editor.set(sampleschema);
editor.editorDom.onkeyup = function() {
	makeForm(getEditorJSON(editor));
};

makeForm(getEditorJSON(editor));
