import folVisitor from './folVisitor.js';

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
export default class TranspileContextVisitor {
    generatePython(context) {
        let code = "# Generated Python Context\n\n";

        // Constants
        const constantNames = context.constants.map(c => c.name);
        code += "# Constants\n";
        code += `constants = ${JSON.stringify(constantNames)}\n\n`;

        code += "# Predicates\n";
        for (const pred of context.predicates) {
            const { name, data, negated } = pred;
            // Convert JavaScript truthTable to Python format (true -> True)
            const truthTable = {};
            for (const [key, value] of Object.entries(data.truthTable || {})) {
                truthTable[key] = value.toString();
            }
            
            code += `def ${name}(*args):\n`;
            code += `    # Truth table for ${name}\n`;
            code += `    truth_table = {\n`;
            // Write each entry with proper Python boolean values
            for (const [key, value] of Object.entries(data.truthTable || {})) {
                code += `        "${key}": ${value ? 'True' : 'False'},\n`;
            }
            code += `    }\n`;
            code += `    key = ','.join(args)\n`;
            if (negated) {
                code += `    return not truth_table.get(key, False)\n`;
            } else {
                code += `    return truth_table.get(key, False)\n`;
            }
            code += "\n";
        }

        // Generate functions
        code += "# Functions\n";
        for (const func of context.functions) {
            const { name, data } = func;
            code += `# Function: ${name}\n`;
            // Properly indent the function code
            const lines = data.split('\n');
            const funcLines = lines.map((line, i) => {
                if (i === 0) return line;  // First line (def statement) stays as is
                return '    ' + line.trimStart();  // Indent other lines with 4 spaces
            });
            code += funcLines.join('\n') + "\n\n";
        }

        return code;
    }
} 