
var sqlPrompts;

/**
 * Searches for an element with id=sql-prompts after startup. SQL Prompts will be added there.
 */
function initUiIndex() {
  sqlPrompts = document.getElementById("sql-prompts");
  if (!sqlPrompts) {
    console.error("Element #sql-prompts not found.")
  }
}

addEventListener("DOMContentLoaded", initUiIndex);


/**
 * This function adds a new db prompt with given name and content.
 */
function addDbPrompt(name, content) {
  sqlPrompts.appendChild(sqlPrompt(name, content));
}

/**
 * If connected to onchange event of `<input type="file">`, this method will create a new sql prompt for each opened file.
 * 
 * Use: `<input type="file" onchange="readSqlFiles(event)" multiple>`
 */
function readSqlFiles(e) {
  console.log("Loading SQL files");
  const files = e.target.files;

  if (files) {
    [...files].sort((a, b) => a.name.localeCompare(b.name)).forEach(f => {
      readTextFile(f).then((content) => {
        console.log("File read: ", f);
        console.log("File content: ", content);
        addDbPrompt(f.name, content);
      });
    })
  }
}

function dumpDbResult(dbResult) {
  console.log(dbResult);
  console.log(dbResult.columns.join("|"))
  const header = `<thead>${dbResult.columns.map(c => `<th>${c}</th>`).join("")}</thead>`;
  const body = `<tbody>${dbResult.values.map(row => `<tr>${row.map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody>`;
  for (const row of dbResult.values) {
    console.log(row.join("|"));
  }
  return `<p>Query Result:</p><table class="resultTable">${header}${body}</table>`
}


function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function sqlPrompt(fileName, content) {
  const div = document.createElement("div");

  const header = document.createElement("p");
  header.innerText = fileName;
  div.appendChild(header);

  const textarea = document.createElement("textarea");
  textarea.value = "select something from me where blub";
  div.appendChild(textarea)
  textarea.value = content;

  const resultDiv = document.createElement("div");

  let editor;
  const closeEditor = () => {
    if (editor) {
      editor.save();
      editor.toTextArea();
      editor = undefined;
    }
  }

  const executeQuery = () => {
    if (editor) {
      editor.save();
    }
    const query = textarea.value;
    console.log("Execute Query\n%s", query)
    const dbresult = db.exec(query);
    //console.log(dbresult);
    resultDiv.innerHTML = dbresult.map(dumpDbResult).join("");
  };

  const activateEditor = () => {
    closeEditor();
    editor = addEditorToTextArea(textarea, executeQuery);
  };

  const refreshAutocompletion = () => {
    if (editor) {
      const tables = getAutocompleteTables();
      editor.setOption("hintOptions", tables);
    }
  };

  const buttonAddEditor = createButton("Show Editor", activateEditor);

  const buttonRemoveEditor = createButton("Hide Editor", () => {
    closeEditor();
  });

  const buttonExecuteQuery = createButton("Execute Query (Ctrl-Enter)", executeQuery);
  const refreshTablesAutocompletion = createButton("Refresh Autocompletion", refreshAutocompletion);

  //div.appendChild(buttonAddEditor);
  //div.appendChild(buttonRemoveEditor);
  div.appendChild(buttonExecuteQuery);
  div.appendChild(refreshTablesAutocompletion);
  div.appendChild(resultDiv);

  Promise.resolve().then(() => activateEditor());

  return div;
}

function getAutocompleteTables() {
  if (db) {
    // inspired by https://stackoverflow.com/a/50548508
    const query = "SELECT m.name as tableName, p.name as columnName\n" +
      "FROM sqlite_master m left outer join pragma_table_info((m.name)) p on m.name <> p.name\n" +
      "order by tableName, columnName;";
    console.log("List All Table Columns Query\n%s", query)
    const dbresult = db.exec(query);
    //console.log("autocomplete result: ", dbresult);

    if (!dbresult[0]) {
      return {};
    }

    const tables = dbresult[0].values.reduce((accumulator, [tableName, columnName]) => {
      if (!accumulator[tableName]) {
        accumulator[tableName] = [];
      }
      accumulator[tableName].push(columnName);
      return accumulator
    }, {})

    console.log("found table columns", tables);

    return ({ tables });
  } else {
    return {};
  }
}

function createButton(label, onclick) {
  const button = document.createElement("button");
  button.type = "button";
  button.innerText = label;
  button.onclick = onclick;
  return button;
}

function addEditorToTextArea(textArea, onCommand) {
  // inspired by
  // https://sql.js.org/examples/GUI/
  // https://github.com/sql-js/sql.js/tree/master/examples/GUI
  return CodeMirror.fromTextArea(textArea, {
    value: "function myScript(){return 100;}\n",
    viewportMargin: Infinity,
    mode: "text/x-mysql",
    theme: "neat",
    lineNumbers: true,
    styleActiveLine: true,
    hint: CodeMirror.hint.sql,
    // see sql-hint.js in https://codemirror.net/5/doc/manual.html#addons
    // https://codemirror.net/5/demo/complete.html
    hintOptions: getAutocompleteTables(),
    extraKeys: {
      "Ctrl-Enter": onCommand,
      "Ctrl-Space": "autocomplete",
    }
  });
}

function checkInputValue() {
  var taskSelect = document.getElementById("taskSelect")
  var selectedValue = parseInt(taskSelect.value)
  var inputValue = document.getElementById("inputValue").value;
  var resultImage = document.getElementById("resultImage");
  //resultImage.style.display = "none";

  if (inputValue == 488549710 && selectedValue == 1
    || inputValue == 318101020 && selectedValue == 2
    || inputValue == 118919679 && selectedValue == 3
    || inputValue == 8 && selectedValue == 4
    || inputValue == 1194420017 && selectedValue == 5) {
    resultImage.src = "correct.jpg";
    resultImage.style.display = "block";
  }
  else {
    resultImage.src = "false.jpg";
    resultImage.style.display = "block";
  }
}
