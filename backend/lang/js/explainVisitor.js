import antlr4 from 'antlr4';
import folParser from './folParser.js';
import folVisitor from './folVisitor.js';


// example: 
// Human(Socrates) -> forall(x) exists(y) Father(y, x)
// ->
// def implies(x, y):
//     return not x or y
//
// def iff(x, y):
//     return (x and y) or (not x and not y)
//        
// def con_0():
//     return implies(Human("Socrates"), all([any([Father(y, x) for y in constants]) for x in constants])) 

// note that constants should be capitalized in the input, e.g. "Socrates" instead of "socrates", variables should be lowercase, e.g. "x" instead of "X"


export default class ExplainVisitor extends folVisitor {
    constructor() {
        super();
        this.quantifiedVariables = new Set();
    }

	// Visit a parse tree produced by folParser#condition.
	visitCondition(ctx) {
        const formulas = ctx.formula();
        return formulas.map((f, i) => `con_${i} = ~(${this.visit(f)})`).join('\n');
	}


	// Visit a parse tree produced by folParser#formula.
	visitFormula(ctx) {
        if (ctx.bin_connective()) {
            const formulas = ctx.formula();
            const bin_connective = ctx.bin_connective().getText();

            let not = ctx.NOT() ? "~ " : "";

            if (bin_connective === '&&') {
                return `(${not} ${this.visit(formulas[0])}) & ${this.visit(formulas[1])}`;
            }
            else if (bin_connective === '||') {
                return `(${not} ${this.visit(formulas[0])}) | ${this.visit(formulas[1])}`;
            }
            else if (bin_connective === '->') {
                return `(${not} ${this.visit(formulas[0])}) >> ${this.visit(formulas[1])}`;
            }
            else if (bin_connective === '<->') {
                return `((${not} ${this.visit(formulas[0])}) << ${this.visit(formulas[1])}) | ((${not} ${this.visit(formulas[0])}) >> ${this.visit(formulas[1])})`;
            }
            
        }
        else if (ctx.NOT()) {
            return "~ " + this.visit(ctx.formula(0));
        }
        else if (ctx.FORALL()) {
            const variable = ctx.variable().getText();
            const formula = this.visit(ctx.formula(0));
            this.quantifiedVariables.add(variable);

            return `And(*[(${formula}).subs({${variable}: constant}) for constant in constants])`;
        }
        else if (ctx.EXISTS()) {
            const variable = ctx.variable().getText();
            const formula = this.visit(ctx.formula(0));
            this.quantifiedVariables.add(variable);

            return `Or(*[(${formula}).subs({${variable}: constant}) for constant in constants])`;
        }
        else if (ctx.pred_constant()) {
            const pred = ctx.pred_constant().getText();
            const terms = ctx.term().map(term => this.visit(term)).join(', ');

            return pred + "(" + terms + ")";
        }
		else if (ctx.term()) {
            return this.visit(ctx.term()[0]) + " == " + this.visit(ctx.term()[1]);
        }
	}


	// Visit a parse tree produced by folParser#term.
	visitTerm(ctx) {
        if (ctx.func_constant()) {
            const res = ctx.func_constant().getText() + '(' + ctx.term().map(term => this.visit(term)).join(', ') + ')';
            // console.log("term visit: " + res);
            return res;
        }
        else if (ctx.ind_constant()) {
            return ctx.ind_constant().getText() ;
        }
        else if (ctx.variable()) {
            return ctx.variable().getText(); 
        }

	}    

}