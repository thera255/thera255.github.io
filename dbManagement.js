var db;

/**
 * This file provides methods to manage a single database.
 * 
 * After creation, the database is accessible via the global variable named 'db'.
 */

var databaseStateLabel;
var saveByteArray;

function initUiDbManagement() {
  databaseStateLabel = document.getElementById("database state");
  saveByteArray = setupSaveMethod();
}

addEventListener("DOMContentLoaded", initUiDbManagement);

// from https://stackoverflow.com/questions/23451726/saving-binary-data-as-file-using-javascript-from-a-browser
function setupSaveMethod() {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, name) {
    const blob = new Blob(data, {type: "octet/stream"}),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}

/**
 * Discards the previously created database.
 */
function closeDb() {
  if (db) {
    db.close();
    db = undefined;
    console.log('DB Closed');
    setDatabaseState("no database")
  }
}

/**
 * Creates a new empty database.
 */
function createNewDb() {
  closeDb();
  db = new SQL.Database();
  console.log('New database created');
  setDatabaseState("Database created")
}

function loadDb(filename, data) {
  closeDb();
  db = new SQL.Database(data);
  console.log("Database loaded from '%s'", filename);
  setDatabaseState("Database loaded from " + filename)
}

/**
 * Provides the database content as a download.
 */
function saveDb() {
  const exportedData = db.export();
  console.log("Database exported");
  console.log(exportedData);
  saveByteArray([exportedData], 'sql-game.db');
}

/**
 * If connected to onchange event of `<input type="file">`, this method will create a new database with the file's content.
 * 
 * Use: `<input type="file" onchange="inputFileChanged(event)">`
 */
function inputFileChanged(e) {
  console.log("Loading from file");
  const files = e.target.files;

  if (files && files.length === 1) {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("File read");
      const data = new Int8Array(reader.result);
      loadDb(files[0].name, data);
      e.target.value = '';
    };
    reader.readAsArrayBuffer(files[0]);
  }
}

function setDatabaseState(state) {
  if (databaseStateLabel)
    databaseStateLabel.innerText = state;
}