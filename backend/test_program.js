import { generateProgram } from './lang/js/transpileProgram.js';

// Sample context (same as before)
const testContext = {
    constants: [
        { id: 1, name: "Socrates" },
        { id: 2, name: "Plato" },
        { id: 3, name: "Zeus" }
    ],
    predicates: [
        {
            name: "Human",
            data: {
                paramCount: 1,
                truthTable: {
                    "Socrates": true,
                    "Plato": true,
                    "Zeus": false
                }
            },
            negated: false
        },
        {
            name: "Mortal",
            data: {
                paramCount: 1,
                truthTable: {
                    "Socrates": true,
                    "Plato": true,
                    "Zeus": false
                }
            },
            negated: false
        }
    ],
    functions: [
        {
            name: "age_of",
            data: "def age_of(x):\n    ages = {'Socrates': 70, 'Plato': 50, 'Zeus': 1000}\n    return ages.get(x, 0)"
        }
    ]
};

// Sample rules
const testRules = [
    {
        code: "Human(Socrates) -> Mortal(Socrates)",  // Should be satisfied
        enabled: true
    },
    {
        code: "forall(x) Human(x) -> Mortal(x)",      // Should be satisfied
        enabled: true
    },
    {
        code: "Human(Zeus)",                          // Should fail
        enabled: true
    }
];

// Generate the complete program
const program = generateProgram(testContext, testRules);

// Save to a file so we can run it
import fs from 'fs';
fs.writeFileSync('generated_program.py', program);

console.log("Generated program saved to generated_program.py"); 