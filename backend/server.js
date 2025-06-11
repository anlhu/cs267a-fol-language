import express from 'express';
import antlr4 from 'antlr4';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { filterSyntax, generateProgram } from './lang/js/transpileProgram.js';

const { InputStream, CommonTokenStream } = antlr4;

import folLexer from './lang/js/folLexer.js';
import folParser from './lang/js/folParser.js';
import transpileVisitor from './lang/js/transpileVisitor.js';

const app = express();
const port = 8080;

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],  // Frontend URLs
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Enable CORS with options
app.use(cors(corsOptions));
app.use(express.json());

// Handle pre-flight requests
app.options('*', cors(corsOptions));

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

export function transpile(text) {
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

app.post('/evaluate', (req, res) => {
  const { constraints, constants, predicates, functions } = req.body;
  const tempFile = 'temp_program.py';
  const tempFile2 = 'temp_program2.py';
  
  try {
    // filter the syntactically correct constraints
    let [passedConstraints, failedConstraints] = filterSyntax(constraints);

    // Generate Python program
    const program = generateProgram(
      { constants, predicates, functions },  // context
      passedConstraints  // rules
    );
    
    // Save to a temporary file
    writeFileSync(tempFile, program);
    
    try {
      // Execute the program and capture output
      const output = execSync(`python3 ${tempFile}`, { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'] // Capture both stdout and stderr
      });
      
      // Parse the Python output back to JSON
      const results = JSON.parse(output);

      // Add failed constraints to results
      failedConstraints.forEach((rule) => {
        results[`Rule ${rule.number}`] = { satisfied: false, rule: rule.code, error: rule.error || 'Syntax error' };
      });
      
      res.json({ results });
    } catch (execError) {
      // Handle Python execution errors
      res.status(400).json({ 
        error: `Python execution error: ${execError.stderr || execError.message}`
      });
    } finally {
      // Always clean up the temp file
      try {
        unlinkSync(tempFile);
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError);
      }
    }
  } catch (error) {
    // Handle other errors (e.g. program generation, file writing)
    res.status(400).json({ error: error.message });
    
    // Try to clean up if the file exists
    try {
      unlinkSync(tempFile);
    } catch (cleanupError) {
      // Ignore cleanup errors at this point
    }
  }
});

// app.get('/', (req, res) => {
//   console.log(transpile("Human(Socrates) -> forall(x) exists(y) Father(y, x)"));
// })

// Start server with error handling
const server = app.listen(port, () => {
  console.log(`Parser API running at http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use. The server is probably already running.`);
  } else {
    console.error('Failed to start server:', err);
  }
});