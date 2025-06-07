import { generateProgram } from './lang/js/transpileProgram.js';

const context = {
    constants: [
        { id: 1, name: "Socrates" },
        { id: 2, name: "Plato" },
        { id: 3, name: "Zeus" }
    ],
    predicates: [
        {
            name: "Human",
            data: {
                arity: 1,
                truthTable: {
                    "Socrates": true,
                    "Plato": true,
                    "Zeus": false
                }
            },
            negated: false
        }
    ],
    functions: []
};

const rules = [
    { code: "Human(Zeus)", enabled: true }
];

const program = generateProgram(context, rules);
console.log("Generated Python Program:");
console.log("------------------------");
console.log(program); 