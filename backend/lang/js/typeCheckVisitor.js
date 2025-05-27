import folVisitor from './folVisitor.js';
import antlr4 from 'antlr4';

// A simple symbol table to hold declarations
class SymbolTable {
    constructor() {
        this.functions = new Map(); // name -> { arity }
        this.predicates = new Map(); // name -> { arity }
        this.constants = new Map(); // name -> (unused sort)
    }

    registerFunction(name, arity) {
        if (!this.functions.has(name)) {
            this.functions.set(name, { arity });
        }
    }
    registerPredicate(name, arity) {
        if (!this.predicates.has(name)) {
            this.predicates.set(name, { arity });
        }
    }
    registerConstant(name) {
        if (!this.constants.has(name)) {
            this.constants.set(name, true);
        }
    }

    lookupFunction(name, node) {
        const entry = this.functions.get(name);
        if (!entry) throw new TypeError(node, `Unknown function '${name}'`);
        return entry;
    }
    lookupPredicate(name, node) {
        const entry = this.predicates.get(name);
        if (!entry) throw new TypeError(node, `Unknown predicate '${name}'`);
        return entry;
    }
    lookupConstant(name, node) {
        if (!this.constants.has(name)) {
            throw new TypeError(node, `Unknown constant '${name}'`);
        }
        return true; // all constants are just Object
    }
}

// First pass visitor to register symbols
class DeclarationVisitor extends folVisitor {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }

    visitFormula(ctx) {
        if (ctx.pred_constant()) {
            const name = ctx.pred_constant().getText();
            const arity = ctx.term().length;
            this.symbolTable.registerPredicate(name, arity);
        }
        return super.visitFormula(ctx);
    }

    visitTerm(ctx) {
        if (ctx.func_constant()) {
            const name = ctx.func_constant().getText();
            const arity = ctx.term().length;
            this.symbolTable.registerFunction(name, arity);
        }
        if (ctx.ind_constant()) {
            const name = ctx.ind_constant().getText();
            this.symbolTable.registerConstant(name);
        }
        return super.visitTerm(ctx);
    }
}

class TypeError extends Error {
    constructor(node, message) {
        const line = node.start?.line ?? '?';
        super(`Type error at line ${line}: ${message}`);
        this.node = node;
    }
}

export default class TypeCheckVisitor extends folVisitor {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }

    visitFormula(ctx) {
        if (ctx.bin_connective()) {
            // no sort checks beyond Bool
            this.visit(ctx.formula(0));
            this.visit(ctx.formula(1));
            return 'Bool';
        }
        if (ctx.NOT()) {
            this.visit(ctx.formula(0));
            return 'Bool';
        }
        if (ctx.FORALL() || ctx.EXISTS()) {
            // simply check body
            this.visit(ctx.formula(0));
            return 'Bool';
        }
        if (ctx.pred_constant()) {
            const name = ctx.pred_constant().getText();
            const sig = this.symbolTable.lookupPredicate(name, ctx);
            const args = ctx.term();
            if (args.length !== sig.arity)
                throw new TypeError(ctx, `${name} expects ${sig.arity} args but got ${args.length}`);
            // visit args for completeness
            args.forEach(arg => this.visit(arg));
            return 'Bool';
        }
        if (ctx.EQUAL()) {
            // no type compare, treat any two terms as comparable
            this.visit(ctx.term(0));
            this.visit(ctx.term(1));
            return 'Bool';
        }
        return super.visitFormula(ctx);
    }

    visitTerm(ctx) {
        if (ctx.ind_constant()) {
            const name = ctx.ind_constant().getText();
            this.symbolTable.lookupConstant(name, ctx);
            return 'Object';
        }
        if (ctx.func_constant()) {
            const name = ctx.func_constant().getText();
            const sig = this.symbolTable.lookupFunction(name, ctx);
            const args = ctx.term();
            if (args.length !== sig.arity)
                throw new TypeError(ctx, `${name} expects ${sig.arity} args but got ${args.length}`);
            args.forEach(arg => this.visit(arg));
            return 'Object';
        }
        return super.visitTerm(ctx);
    }
}

