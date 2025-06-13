/**
 * everything except constraints --> context.
 * Input format from frontend:
 * {
 *   constants: [{ id: number, name: string }],
 *   predicates: [{ 
 *     name: string, 
 *     data: { 
 *       paramCount: number,
 *       truthTable: { [key: string]: boolean } 
 *     },
 *     negated: boolean
 *   }],
 *   functions: [{ name: string, data: string }]
 * }
 */
export default class ExplainContextVisitor {
    generatePython(context) {
        // constants
        const constantNames = context.constants.map(c => c.name);
        const constantsCodes = [];
        for (const constant of constantNames) {
            constantsCodes.push(`${constant} = symbols('${constant}')`);
        }
        const constantsCodeJoined = constantsCodes.join('\n');

        // predicates
        const predicatesCodes = [];
        for (const pred of context.predicates) {
            const { name, data, negated } = pred;
            // predicatesCodes.push(`${name} = predicate('${name}')`);
            predicatesCodes.push(`class ${name}(BooleanFunction): pass`);
        }
        const predicatesCodeJoined = predicatesCodes.join('\n');

        // functions
        // Wont be able to handle functions in SymPy, it would be infeasible to build something from scratch.
        // const functionsCodes = [];
        // for (const func of context.functions) {
        //     const { name, data } = func;
        //     functionsCodes.push(`${name} = predicate('${name}')`);
        // }
        // const functionsCodesJoined = functionsCodes.join('\n');
        // Generate functions
        let functionCode = "";
        for (const func of context.functions) {
            const { name, data } = func;
            functionCode += data + "\n\n";
        }

        // quantified variables
        const quantifiedVariables = context.quantifiedVariables || [];
        const quantifiedVariablesCodes = [];
        for (const variable of quantifiedVariables) {
            quantifiedVariablesCodes.push(`${variable} = symbols('${variable}')`);
        }
        const quantifiedVariablesCodeJoined = quantifiedVariablesCodes.join('\n');

        let code = `
# Generated Python Context

from sympy import symbols, Function, Symbol
from sympy.logic.boolalg import And, Or, Not, Implies, simplify_logic, BooleanFunction, true, false, to_dnf

# Constants
${constantsCodeJoined}
constants = [${constantNames.join(', ')}]

# Predicates
def predicate(name):
    def p(*args):
        ret = Symbol(f"{name}({','.join(str(arg) for arg in args)})")
        return ret

    return p
${predicatesCodeJoined}

# Functions
${functionCode}

# Quantified Variables
${quantifiedVariablesCodeJoined}
`;

        return code;
    }
} 