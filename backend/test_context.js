import TranspileContextVisitor from './lang/js/transpileContextVisitor.js';

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
            name: "Father",
            data: {
                paramCount: 2,
                truthTable: {
                    "Zeus,Plato": true,
                    "Zeus,Socrates": false
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

const visitor = new TranspileContextVisitor();
const pythonCode = visitor.generatePython(testContext);
console.log(pythonCode); 