const express = require('express');
const antlr4  = require('antlr4');                    
const { InputStream, CommonTokenStream } = antlr4;

const FolLexer  = (require('./lang/js/folLexer').FolLexer   ||
                   require('./lang/js/folLexer').default);
const FolParser = (require('./lang/js/folParser').FolParser ||
                   require('./lang/js/folParser').default);

const app  = express();
const port = 3000;

app.use(express.json());

/* ---------- helper ---------- */
function isParsable(text) {
  const chars  = new InputStream(text);
  const lexer  = new FolLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new FolParser(tokens);

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

// console.log(isParsable("forall(x) exists(y) Human(x) -> Father(y,x)"));

/* ---------- API ---------- */
app.post('/parse', (req, res) => {
  const { input } = req.body;
  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'Input must be a string.' });
  }
  res.json({ parsed: isParsable(input) });
});

app.listen(port, () =>
  console.log(`Parser API running at http://localhost:${port}`)
);
