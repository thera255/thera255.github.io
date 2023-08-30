function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function createTestTable() {
  console.log('Try to do something');
  // Run a query without reading the results
  db.run("CREATE TABLE test (col1 int, col2 char);");
  // Insert two rows: (1,111) and (2,222)
  db.run("INSERT INTO test VALUES (?,?), (?,?)", [1, 111, 2, 222]);
  // Prepare a statement
  const stmt = db.prepare("SELECT * FROM test WHERE col1 BETWEEN $start AND $end");
  stmt.getAsObject({$start: 1, $end: 1}); // {col1:1, col2:111}
  //Bind new values
  stmt.bind({$start: 1, $end: 2});
  while (stmt.step()) {
    const row = stmt.getAsObject();
    console.log('Here is a row: ' + JSON.stringify(row));
  }
  console.log("hi ready")
}

function printTestTable() {
  const data = db.exec("SELECT * FROM test");
  data.forEach(dumpDbResult)
}

function addNewEmptyPrompt() {
  addDbPrompt("new", "select * from test")
}

function showText(tid) {
  var textElement = document.getElementById(tid);
  textElement.style.display = "block";
}