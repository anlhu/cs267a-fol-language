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

function getCombinations(arr, k) {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];
    const [first, ...rest] = arr;
    const withFirst = getCombinations(rest, k - 1).map(comb => [first, ...comb]);
    const withoutFirst = getCombinations(rest, k);
    return withFirst.concat(withoutFirst);
}

export default class ExplainContextVisitor {
    generatePython(context) {
        const constantNames = context.constants.map(c => c.name);

        const predicatesCodes = [];
        for (const pred of context.predicates) {
            const { name, data, negated } = pred;
            const {paramCount, truthTable} = data;

            const namesListUnderscore = [];
            const namesListParens = [];
            const constNameCombos = getCombinations(constantNames, paramCount);
            for (const combo of constNameCombos) {
                namesListUnderscore.push([name, ...combo].join('_'));
                namesListParens.push(`${name}(${combo.join(', ')})`);
            }

            const commaList = namesListUnderscore.join(', ');
            const spaceList = namesListParens.join(' ');
            predicatesCodes.push(`${commaList} = symbols('${spaceList}')`);
        }
        predicatesCodes = predicatesCodes.join('\n');

        // Wont be able to handle functions in SymPy, it would be infeasible to build something from scratch.

        let code = `
# Generated Python Context

from sympy import symbols
from sympy.logic.boolalg import And, Or, Not, Implies, simplify_logic

# Predicates
${predicatesCodes}

`;

        return code;
    }
} 