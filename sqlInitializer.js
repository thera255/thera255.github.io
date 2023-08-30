var SQL;

/**
 * This function checks, that sql and codemirror modules are available
 * Then this function initializes the sql module and puts the sql accessor into the global variable named 'SQL'.
 */
async function initSql () {
  if (typeof initSqlJs !== "function") {
    document.body.innerHTML = '<a href="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-asm-debug.js" target="_blank">Please make sure you have access to sql.js/sql-asm-debug.js</a>';
  }
  else {
    SQL = await initSqlJs();
    if (!SQL) {
      document.body.innerHTML = '<p>initSqlJs failed for some reason.</p>';
    }
  }

  if (typeof CodeMirror !== "function") {
    document.body.innerHTML = `<a href="https://codemirror.net/5/doc/releases.html" target="_blank">Please make sure you have CodeMirror Version 5.x.</a>
<p>You need</p>
<li>codemirror/lib/codemirror.js</li>
<li>codemirror/lib/codemirror.css</li>
<li>codemirror/mode/sql/sql.js</li>
<li>codemirror/theme/neat.css</li>
<li>codemirror/addon/selection/active-line.js</li>
`;
  }
}

addEventListener("DOMContentLoaded", initSql);
