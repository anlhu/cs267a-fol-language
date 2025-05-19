// Generated from fol.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link folParser}.
 */
public interface folListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link folParser#condition}.
	 * @param ctx the parse tree
	 */
	void enterCondition(folParser.ConditionContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#condition}.
	 * @param ctx the parse tree
	 */
	void exitCondition(folParser.ConditionContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#formula}.
	 * @param ctx the parse tree
	 */
	void enterFormula(folParser.FormulaContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#formula}.
	 * @param ctx the parse tree
	 */
	void exitFormula(folParser.FormulaContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#term}.
	 * @param ctx the parse tree
	 */
	void enterTerm(folParser.TermContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#term}.
	 * @param ctx the parse tree
	 */
	void exitTerm(folParser.TermContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#bin_connective}.
	 * @param ctx the parse tree
	 */
	void enterBin_connective(folParser.Bin_connectiveContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#bin_connective}.
	 * @param ctx the parse tree
	 */
	void exitBin_connective(folParser.Bin_connectiveContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#variable}.
	 * @param ctx the parse tree
	 */
	void enterVariable(folParser.VariableContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#variable}.
	 * @param ctx the parse tree
	 */
	void exitVariable(folParser.VariableContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#pred_constant}.
	 * @param ctx the parse tree
	 */
	void enterPred_constant(folParser.Pred_constantContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#pred_constant}.
	 * @param ctx the parse tree
	 */
	void exitPred_constant(folParser.Pred_constantContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#ind_constant}.
	 * @param ctx the parse tree
	 */
	void enterInd_constant(folParser.Ind_constantContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#ind_constant}.
	 * @param ctx the parse tree
	 */
	void exitInd_constant(folParser.Ind_constantContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#func_constant}.
	 * @param ctx the parse tree
	 */
	void enterFunc_constant(folParser.Func_constantContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#func_constant}.
	 * @param ctx the parse tree
	 */
	void exitFunc_constant(folParser.Func_constantContext ctx);
	/**
	 * Enter a parse tree produced by {@link folParser#separator}.
	 * @param ctx the parse tree
	 */
	void enterSeparator(folParser.SeparatorContext ctx);
	/**
	 * Exit a parse tree produced by {@link folParser#separator}.
	 * @param ctx the parse tree
	 */
	void exitSeparator(folParser.SeparatorContext ctx);
}