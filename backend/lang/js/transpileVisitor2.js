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


export default class TranspileVisitor extends folVisitor {

	// Visit a parse tree produced by folParser#condition.
	visitCondition(ctx) {
        console.log(antlr4.tree.Trees.toStringTree(ctx, folParser.ruleNames));

        const formulas = ctx.formula();
       let res = "def implies(x, y):\n    return not x or y\n\ndef iff(x, y):\n    return (x and y) or (not x and not y)\n\n";

        for (const [i, formula] of formulas.entries()) {
            const con = `def con_${i}():\n    return ${this.visit(formula)}`
            res += con + '\n';
        }

		return res;
	}


	// Visit a parse tree produced by folParser#formula.
	visitFormula(ctx) {
        if (ctx.bin_connective()) {
            const formulas = ctx.formula();
            const bin_connective = ctx.bin_connective().getText();

            let not = "";
            if (ctx.NOT()) {
                not = "not "
            }

            if (bin_connective === '&&') {
                return not + this.visit(formulas[0]) + ' and ' + this.visit(formulas[1]);
            }
            else if (bin_connective === '||') {
                return not + this.visit(formulas[0]) + ' or ' + this.visit(formulas[1]);
            }
            else if (bin_connective === '->') {
                return not + `implies(${this.visit(formulas[0])}, ${this.visit(formulas[1])})`;
            }
            else if (bin_connective === '<->') {
                return not + `iff(${this.visit(formulas[0])}, ${this.visit(formulas[1])})`;
            }
            
        }
        else if (ctx.NOT()) {
            return "not " + this.visit(ctx.formula(0));
        }
        else if (ctx.FORALL()) {
            const variable = ctx.variable().getText();
            const formula = this.visit(ctx.formula(0));

            return `all([${formula} for ${variable} in constants])`;
        }
        else if (ctx.EXISTS()) {
            const variable = ctx.variable().getText();
            const formula = this.visit(ctx.formula(0));

            return `any([${formula} for ${variable} in constants])`;
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
            return '"' + ctx.ind_constant().getText() + '"';
        }
        else if (ctx.variable()) {
            return ctx.variable().getText(); 
        }

	}


	// Visit a parse tree produced by folParser#bin_connective.
	visitBin_connective(ctx) { 
		return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by folParser#variable.
	visitVariable(ctx) {
		return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by folParser#pred_constant.
	visitPred_constant(ctx) {
		return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by folParser#ind_constant.
	visitInd_constant(ctx) {
		return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by folParser#func_constant.
	visitFunc_constant(ctx) {
		return this.visitChildren(ctx);
	}


	// Visit a parse tree produced by folParser#separator.
	visitSeparator(ctx) {
		return ',';
	}

    

}