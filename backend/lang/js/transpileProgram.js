import TranspileContextVisitor from './transpileContextVisitor.js';
import { transpile } from '../../server.js';  // We'll need to export this from server.js

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
`;

    // 3. Transpile each enabled rule
    const ruleCode = rules
        .filter(rule => rule.enabled)
        .map((rule, index) => {
            const transpiled = transpile(rule.code);
            // Extract just the constraint function, skip the helper functions
            const lines = transpiled.split('\n');
            const constraintFunc = lines
                .slice(lines.findIndex(line => line.startsWith('def con_')))
                .join('\n')
                .replace('con_0', `con_${index}`);  // Replace con_0 with the correct index
            return constraintFunc;
        })
        .join('\n\n');

    // 4. Generate main evaluation code
    const evalCode = `
# Evaluate all rules
def evaluate_rules():
    results = {}
    ${rules
        .filter(rule => rule.enabled)
        .map((rule, index) => `
    try:
        results["Rule ${index + 1}"] = {
            "satisfied": con_${index}(),
            "rule": """${rule.code}"""
        }
    except Exception as e:
        results["Rule ${index + 1}"] = {
            "error": str(e),
            "rule": """${rule.code}"""
        }`)
        .join('\n')}
    return results

# Run evaluation and print results
if __name__ == "__main__":
    print(evaluate_rules())
`;

    // 5. Combine all parts and ensure proper indentation
    const pythonCode = `${contextCode}\n${helperCode}\n${ruleCode}\n${evalCode}`;
    
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