const express = require('express');
const antlr4  = require('antlr4');                    
const { InputStream, CommonTokenStream } = antlr4;


const folLexer = require('./lang/js/folLexer.js').default;
const folParser = require('./lang/js/folParser.js').default;
const transpileVisitor = require('./lang/js/transpileVisitor.js').default;

const app  = express();
const port = 8080;

app.use(express.json());

/* ---------- helper ---------- */
function isParsable(text) {
  const chars  = new InputStream(text);
  const lexer  = new folLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new folParser(tokens);

  const counter = { 
    count: 0, 
    syntaxError() { this.count += 1; }, 
    reportAmbiguity() {},
    reportAttemptingFullContext(){},
    reportContextSensitivity()  {}
    };

  parser.removeErrorListeners();         
  parser.addErrorListener(counter);

  parser.buildParseTrees = true;
  parser.condition();                    

  return counter.count == 0;
}

function transpile(text) {
  const chars  = new InputStream(text);
  const lexer  = new folLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new folParser(tokens);

  parser.removeErrorListeners();         
  parser.addErrorListener({
    syntaxError: (recognizer, offendingSymbol, line, column, msg, e) => {
      throw new Error(`Syntax error at line ${line}:${column} – ${msg}`);
    },
    reportAmbiguity:            () => {},
    reportAttemptingFullContext: () => {},
    reportContextSensitivity:    () => {}
  });

  parser.buildParseTrees = true;
  const tree = parser.condition();

  const tv = new transpileVisitor();
  const result = tv.visit(tree);
  
  return result;
}

// console.log(isParsable("forall(x) exists(y) Human(x) -> Father(y,x)"));

/* ---------- API ---------- */
app.post('/parse', (req, res) => {
  const { input } = req.body;
  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'Input must be a string.' });
  }
  res.json({ parsed: isParsable(input) });
});

app.post('/transpile', (req, res) => {
  const { input } = req.body;
  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'Input must be a string.' });
  }
  
  try {
    const result = transpile(input);
    res.json({ transpiled: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.get('/', (req, res) => {
//   console.log(transpile("Human(Socrates) -> forall(x) exists(y) Father(y, x)"));
// })


app.listen(port, () =>
  console.log(`Parser API running at http://localhost:${port}`)
);