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

function writeConfig(config) {
	document.querySelector('#config').innerHTML = JSON.stringify(config, undefined, 2);
}

function makeForm(schema) {
	if (!schema) {
		writeConfig('');
		return;
	}
	var config = {};
	var el = document.querySelector('#form');
	el.innerHTML = "";
	var fs = new FormSmith(schema, config, el);
	fs.onChange(function(c) { writeConfig(c); });
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
// jsoneditor is a bit unreliable and I had to circumvent the API
editor.editorDom.onkeyup = function() {
	makeForm(getEditorJSON(editor));
};

makeForm(getEditorJSON(editor));
