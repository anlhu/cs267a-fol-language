import TranspileContextVisitor from './transpileContextVisitor.js';
import { transpile } from '../../server.js';  // We'll need to export this from server.js

export function filterSyntax(rules) {
    const passed = [];
    const failed = [];
    rules.filter(rule => rule.enabled).forEach(rule => {
        try {
            transpile(rule.code);
            passed.push(rule);
        } catch (error) {
            failed.push({...rule, error: error.message});
        }
    });
    return [passed, failed];
}

/**
 * Combines context and rules into a complete Python program
 * @param {Object} context - Frontend context (constants, predicates, functions)
 * @param {Array<{code: string, enabled: boolean}>} rules - Array of FOL rules
 * @returns {string} Complete Python program
 */
export function generateProgram(context, rules) {
    // 1. Generate context code
    const contextVisitor = new TranspileContextVisitor();
    const contextCode = contextVisitor.generatePython(context);

    // 2. Generate helper functions needed by transpiled rules
    const helperCode = `
# Helper functions for rules
def implies(x, y):
    return not x or y

def iff(x, y):
    return (x and y) or (not x and not y)

# Global evaluation tracker
evaluation_tracker = []

def track_evaluation(predicate_name, args, result):
    evaluation_tracker.append({
        'predicate': predicate_name,
        'args': args,
        'value': result
    })
    return result
`;

    // 3. Modify predicate functions to track evaluations
    const predicateCode = context.predicates.map(pred => {
        const { name, data, negated } = pred;
        // Convert JavaScript truthTable to Python format
        const truthTable = {};
        for (const [key, value] of Object.entries(data.truthTable || {})) {
            truthTable[key] = value.toString();
        }
        
        return `def ${name}(*args):
    # Truth table for ${name}
    truth_table = {
${Object.entries(data.truthTable || {}).map(([key, value]) => 
        `        "${key}": ${value ? 'True' : 'False'}`).join(',\n')}
    }
    key = ','.join(args)
    result = ${negated ? 'not ' : ''}truth_table.get(key, False)
    return track_evaluation("${name}", args, result)
`;
    }).join('\n\n');

    // 4. Transpile each enabled rule
    const ruleCode = rules
        .filter(rule => rule.enabled)
        .map((rule) => {
            const transpiled = transpile(rule.code);
            // Extract just the constraint function, skip the helper functions
            const lines = transpiled.split('\n');
            const constraintFunc = lines
                .slice(lines.findIndex(line => line.startsWith('def con_')))
                .join('\n')
                .replace('con_0', `con_${rule.number}`);  // Replace con_0 with the correct index
            return constraintFunc;
        })
        .join('\n\n');

    // 5. Generate main evaluation code
    const evalCode = `
# Evaluate all rules
def evaluate_rules():
    import json
    global evaluation_tracker
    results = {}
    ${rules
        .filter(rule => rule.enabled)
        .map((rule) => `
    try:
        # Reset tracker for this rule
        evaluation_tracker = []
        
        # Convert Python bool to JSON bool
        result = bool(con_${rule.number}())
        results["Rule ${rule.number}"] = {
            "satisfied": result,
            "rule": """${rule.code}""",
            "evaluations": evaluation_tracker
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

    // 6. Combine all parts and ensure proper indentation
    const pythonCode = `${contextCode}\n${helperCode}\n${predicateCode}\n${ruleCode}\n${evalCode}`;
    
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