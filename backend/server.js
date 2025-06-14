import express from 'express';
import antlr4 from 'antlr4';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { filterSyntax, generateProgram } from './lang/js/transpileProgram.js';
import { filterSyntaxExplainer, generateExplainerProgram } from './lang/js/explainTranspiler.js';

const { InputStream, CommonTokenStream } = antlr4;

import folLexer from './lang/js/folLexer.js';
import folParser from './lang/js/folParser.js';
import transpileVisitor from './lang/js/transpileVisitor.js';
import ExplainVisitor from './lang/js/explainVisitor.js';

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

export function transpileExplainer(text) {
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

  const tv = new ExplainVisitor();
  const result = tv.visit(tree);
  const quantifiedVariables = Array.from(tv.quantifiedVariables);

  return { result, quantifiedVariables };
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
    let [passedExplainConstraints, failedExplainConstraints] = filterSyntaxExplainer(constraints);

    // Generate Python program
    const program = generateProgram(
      { constants, predicates, functions },  // context
      passedConstraints  // rules
    );

    const program2 = generateExplainerProgram(
      { constants, predicates, functions },  // context
      passedExplainConstraints  // rules
    );
    
    // Save to a temporary file
    writeFileSync(tempFile, program);
    writeFileSync(tempFile2, program2);
    
    try {
      // Execute the program and capture output
      const output = execSync(`python3 ${tempFile}`, { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'] // Capture both stdout and stderr
      });
      
      // Parse the Python output back to JSON
      const results = JSON.parse(output);

      // get info from those that are not satisfied
      const output2 = execSync(`python3 ${tempFile2}`, { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'] // Capture both stdout and stderr
      });
      const results2 = JSON.parse(output2);
      for (const item in results) {
        results[item].explanation = results2[item].result;
      }

      // Add syntax failed constraints to results
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
        unlinkSync(tempFile2);
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
      unlinkSync(tempFile2);
    } catch (cleanupError) {
      // Ignore cleanup errors at this point
      console.error('Failed to cleanup temp file:', cleanupError);
    }
  }
});

app.post('/generate', (req, res) => {
  const { constraints, constants, predicates, functions, numConstants } = req.body;
  const tempFile = 'temp_solver.py';
  
  try {
    // Filter the syntactically correct constraints
    let [passedConstraints, failedConstraints] = filterSyntax(constraints);

    // If we have no enabled constraints, we can just generate random constants
    if (passedConstraints.length === 0 && numConstants > 0) {
      // Return a solution with just the new constants and no predicate assignments
      const newConstants = Array.from({length: numConstants}, (_, i) => `NewConstant${i+1}`);
      return res.json({
        success: true,
        solution: {
          new_constants: newConstants,
          predicate_assignments: {}
        },
        failedConstraints: []
      });
    }

    // Helper function to convert JavaScript booleans to Python booleans in JSON
    const convertBooleans = (obj) => {
      if (typeof obj === 'boolean') {
        return obj ? 'True' : 'False';
      }
      if (Array.isArray(obj)) {
        return obj.map(convertBooleans);
      }
      if (obj && typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, convertBooleans(value)])
        );
      }
      return obj;
    };

    // Convert JavaScript booleans to Python booleans in all data
    const pythonPredicates = convertBooleans(predicates);
    const pythonConstraints = convertBooleans(passedConstraints);
    const pythonConstants = convertBooleans(constants);
    const pythonFunctions = convertBooleans(functions);

    // Create a temporary Python file to run the CSP solver
    const solverCode = `
import sys
sys.path.append('/workspaces/cs267a-fol-language/backend')
from fol_csp_solver import FOLCSPSolver
import json
import logging

# Set up logging to capture everything
logging.basicConfig(level=logging.DEBUG, format='%(message)s')
logger = logging.getLogger()

# Create a string buffer to capture logs
import io
log_capture = io.StringIO()
handler = logging.StreamHandler(log_capture)
handler.setFormatter(logging.Formatter('%(message)s'))
logger.addHandler(handler)

try:
    # Input data
    constants = ${JSON.stringify(pythonConstants)}
    predicates = ${JSON.stringify(pythonPredicates)}
    functions = ${JSON.stringify(pythonFunctions)}
    constraints = ${JSON.stringify(pythonConstraints)}
    num_constants = ${numConstants}

    # Create and run solver
    solver = FOLCSPSolver(constants, predicates, functions, constraints)
    solution = solver.solve(num_constants)
    
    # Get the logs
    logs = log_capture.getvalue()
    
    if solution:
        print(json.dumps({
            'success': True,
            'solution': solution,
            'failedConstraints': [],
            'logs': logs
        }))
    else:
        print(json.dumps({
            'success': False,
            'error': 'No solution found that satisfies all constraints',
            'failedConstraints': [],
            'logs': logs
        }))
except Exception as e:
    # Get the logs even if there was an error
    logs = log_capture.getvalue()
    print(json.dumps({
        'success': False,
        'error': str(e),
        'failedConstraints': [],
        'logs': logs
    }))
finally:
    log_capture.close()
`;

    // Save to a temporary file
    writeFileSync(tempFile, solverCode);
    
    try {
      // Execute the program and capture output
      const output = execSync(`python3 ${tempFile}`, { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'] // Capture both stdout and stderr
      });
      
      // Parse the Python output back to JSON
      const result = JSON.parse(output);
      
      // Add any syntax-failed constraints
      result.failedConstraints = failedConstraints.map(rule => ({
        number: rule.number,
        code: rule.code,
        error: rule.error || 'Syntax error'
      }));
      
      // Log the debug output
      if (result.logs) {
        console.log("Python solver logs:", result.logs);
      }
      
      res.json(result);
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
    res.status(400).json({ 
      error: `Failed to generate program: ${error.message}`
    });
    
    // Try to clean up if the file exists
    try {
      unlinkSync(tempFile);
    } catch (cleanupError) {
      // Ignore cleanup errors at this point
      console.error('Failed to cleanup temp file:', cleanupError);
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