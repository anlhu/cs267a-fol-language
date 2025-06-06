import antlr4 from 'antlr4';
import folParser from './folParser.js';
import folVisitor from './folVisitor.js';


// Human(Socrates) -> forall(x) Father(Father, x)

// transform foralls and exists to lambdas
// not Human(Socrates) and all([Father(Father, x) for x in constants])

// exists(x) Human(x)

// for x in constants:
//     if Human(x): return (True, None)
//     else: return (False, Human(x))

// forall(x) exists(y) Human(x) -> Father(y, x)

// output: (True, None) or (False, unsatisfied predicate)
// True if data in table satisfies the statement
// False otherwise
// for constant in constants:

export default class TranspileVisitor extends folVisitor {

	// Visit a parse tree produced by folParser#condition.
	visitCondition(ctx) {
        console.log(antlr4.tree.Trees.toStringTree(ctx, folParser.ruleNames));

        const formulas = ctx.formula();
        let res = "";
        for (const formula of formulas) {
            res += this.visit(formula) + '\n';
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
            return ctx.variable().getText(); //TODO: disambiguate var and inc_constant in grammar
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