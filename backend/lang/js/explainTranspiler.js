import ExplainContextVisitor from './explainContextVisitor.js';
import { transpileExplainer } from '../../server.js';  // We'll need to export this from server.js

export function filterSyntaxExplainer(rules) {
    const passed = [];
    const failed = [];
    rules.filter(rule => rule.enabled).forEach(rule => {
        try {
            transpileExplainer(rule.code);
            passed.push(rule);
        } catch (error) {
            failed.push({...rule, error: error.message});
        }
    });
    return [passed, failed];
}

function getCombinations(arr, k) {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];
    // Allow repeated elements (permutation with replacement)
    const results = [];
    function permute(path) {
        if (path.length === k) {
            results.push([...path]);
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            path.push(arr[i]);
            permute(path);
            path.pop();
        }
    }
    permute([]);
    return results;
}

/**
 * Combines context and rules into a complete Python program
 * @param {Object} context - Frontend context (constants, predicates, functions)
 * @param {Array<{code: string, enabled: boolean}>} rules - Array of FOL rules
 * @returns {string} Complete Python program
 */
export function generateExplainerProgram(context, rules) {
    const constantNames = context.constants.map(c => c.name);

    // 0. Extract the quantified variables
    const quantifiedVariablesSet = new Set();
    for (const rule of rules) {
        const { quantifiedVariables } = transpileExplainer(rule.code);
        if (quantifiedVariables) {
            for (const v of quantifiedVariables) {
                quantifiedVariablesSet.add(v);
            }
        }
    }

    // 1. Generate code for context (constants, predicates, functions, quantified variables)
    const contextVisitor = new ExplainContextVisitor();
    const contextCode = contextVisitor.generatePython({...context, quantifiedVariables: Array.from(quantifiedVariablesSet)});

    // 2. Generate instance
    const predicateInstantiations = [];
    const instance = []
    for (const pred of context.predicates) {
        const { name, data, negated } = pred;
        const {paramCount, truthTable} = data;

        const constNameCombos = getCombinations(constantNames, paramCount);
        for (const combo of constNameCombos) {
            const commaList = combo.map(c => `${c}`).join(', ');
            const unnegatedValue = truthTable[combo.join(',')] ?? false;
            const actualValue = negated ? !unnegatedValue : unnegatedValue;
            predicateInstantiations.push(`${name}(${commaList})`);
            instance.push(`(Symbol("${name}(${commaList})"), ${actualValue})`);
        }
    }
    const instanceCode = instance.length > 0 ? instance.join(',\n        ') : '[]';
    const predicateSubs = predicateInstantiations.map(predFunc => `${predFunc} : Symbol("${predFunc}")`).join(', ');

    // 4. Transpile each enabled rule
    const ruleCode = rules
        .filter(rule => rule.enabled)
        .map((rule) => {
            const {result, quantifiedVariables} = transpileExplainer(rule.code);
            // Extract just the constraint function, skip the helper functions
            const lines = result.split('\n');
            const constraintFunc = lines
                .slice(lines.findIndex(line => line.startsWith('def con_')))
                .join('\n')
                .replace('con_0', `con_${rule.number}`);  // Replace con_0 with the correct index
            return `${constraintFunc}.subs({${predicateSubs}})`;
        })
        .join('\n\n');

    // 6. Combine all parts and ensure proper indentation
    const pythonCode = `
${contextCode}

# Reasoning functions
def complete_reason(rule, var, value):
    if rule.has(var):
        var_negated_if_needed = var if value else ~var
        return rule.subs({var: value}) & (
            var_negated_if_needed | (rule.subs({var: ~value}))
        )
    else:
        return rule
        
def complete_reason_instance(rule):
    instance = [
        ${instanceCode}
    ]
    for var, setting in instance:
        rule = complete_reason(rule, var, setting)
    return to_dnf(rule, simplify=True)

# Rule Code
${ruleCode}

# Evaluation
def evaluate_rules():
    import json
    results = {}
    ${rules
        .filter(rule => rule.enabled)
        .map((rule) => `
    try:
        # Convert Python bool to JSON bool
        result = str(complete_reason_instance(con_${rule.number}))
        results["Rule ${rule.number}"] = {
            "rule": """${rule.code}""",
            "result": result
        }
    except Exception as e:
        results["Rule ${rule.number}"] = {
            "error": str(e),
            "rule": """${rule.code}"""
        }`)
        .join('\n')}
    return results

# Run evaluation and print results as JSON
if __name__ == "__main__":
    import json
    print(json.dumps(evaluate_rules()))
`;
    
    // Fix any indentation issues by ensuring each line in function bodies is properly indented
    return pythonCode.split('\n').map(line => {
        if (line.trim().startsWith('def ')) {
            // Keep function definitions at current indentation
            return line;
        } else if (line.trim() && line.startsWith(' ')) {
            // Ensure consistent 4-space indentation for function bodies
            const trimmed = line.trimStart();
            const currentIndent = line.length - line.trimStart().length;
            const desiredIndent = Math.ceil(currentIndent / 4) * 4;
            return ' '.repeat(desiredIndent) + trimmed;
        }
        return line;
    }).join('\n');
} 