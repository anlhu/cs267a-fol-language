// Generated from fol.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue", "this-escape"})
public class folParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, LPAREN=2, RPAREN=3, EQUAL=4, NOT=5, FORALL=6, EXISTS=7, UPPER_CONSTANT=8, 
		LOWER_CONSTANT=9, CONJ=10, DISJ=11, IMPL=12, BICOND=13, ENDLINE=14, WHITESPACE=15;
	public static final int
		RULE_condition = 0, RULE_formula = 1, RULE_term = 2, RULE_bin_connective = 3, 
		RULE_variable = 4, RULE_pred_constant = 5, RULE_ind_constant = 6, RULE_func_constant = 7, 
		RULE_separator = 8;
	private static String[] makeRuleNames() {
		return new String[] {
			"condition", "formula", "term", "bin_connective", "variable", "pred_constant", 
			"ind_constant", "func_constant", "separator"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "','", "'('", "')'", "'=='", "'!'", "'forall'", "'exists'", null, 
			null, "'&&'", "'||'", "'->'", "'<->'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, "LPAREN", "RPAREN", "EQUAL", "NOT", "FORALL", "EXISTS", "UPPER_CONSTANT", 
			"LOWER_CONSTANT", "CONJ", "DISJ", "IMPL", "BICOND", "ENDLINE", "WHITESPACE"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "fol.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public folParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ConditionContext extends ParserRuleContext {
		public List<FormulaContext> formula() {
			return getRuleContexts(FormulaContext.class);
		}
		public FormulaContext formula(int i) {
			return getRuleContext(FormulaContext.class,i);
		}
		public TerminalNode EOF() { return getToken(folParser.EOF, 0); }
		public List<TerminalNode> ENDLINE() { return getTokens(folParser.ENDLINE); }
		public TerminalNode ENDLINE(int i) {
			return getToken(folParser.ENDLINE, i);
		}
		public ConditionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_condition; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterCondition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitCondition(this);
		}
	}

	public final ConditionContext condition() throws RecognitionException {
		ConditionContext _localctx = new ConditionContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_condition);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(18);
			formula(0);
			setState(23);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(19);
					match(ENDLINE);
					setState(20);
					formula(0);
					}
					} 
				}
				setState(25);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(29);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==ENDLINE) {
				{
				{
				setState(26);
				match(ENDLINE);
				}
				}
				setState(31);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(32);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class FormulaContext extends ParserRuleContext {
		public TerminalNode NOT() { return getToken(folParser.NOT, 0); }
		public List<FormulaContext> formula() {
			return getRuleContexts(FormulaContext.class);
		}
		public FormulaContext formula(int i) {
			return getRuleContext(FormulaContext.class,i);
		}
		public Bin_connectiveContext bin_connective() {
			return getRuleContext(Bin_connectiveContext.class,0);
		}
		public TerminalNode FORALL() { return getToken(folParser.FORALL, 0); }
		public TerminalNode LPAREN() { return getToken(folParser.LPAREN, 0); }
		public VariableContext variable() {
			return getRuleContext(VariableContext.class,0);
		}
		public TerminalNode RPAREN() { return getToken(folParser.RPAREN, 0); }
		public TerminalNode EXISTS() { return getToken(folParser.EXISTS, 0); }
		public Pred_constantContext pred_constant() {
			return getRuleContext(Pred_constantContext.class,0);
		}
		public List<TermContext> term() {
			return getRuleContexts(TermContext.class);
		}
		public TermContext term(int i) {
			return getRuleContext(TermContext.class,i);
		}
		public List<SeparatorContext> separator() {
			return getRuleContexts(SeparatorContext.class);
		}
		public SeparatorContext separator(int i) {
			return getRuleContext(SeparatorContext.class,i);
		}
		public TerminalNode EQUAL() { return getToken(folParser.EQUAL, 0); }
		public FormulaContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_formula; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterFormula(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitFormula(this);
		}
	}

	public final FormulaContext formula() throws RecognitionException {
		return formula(0);
	}

	private FormulaContext formula(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		FormulaContext _localctx = new FormulaContext(_ctx, _parentState);
		FormulaContext _prevctx = _localctx;
		int _startState = 2;
		enterRecursionRule(_localctx, 2, RULE_formula, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(71);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				{
				setState(35);
				match(NOT);
				setState(36);
				formula(0);
				setState(37);
				bin_connective();
				setState(38);
				formula(6);
				}
				break;
			case 2:
				{
				setState(40);
				match(NOT);
				setState(41);
				formula(5);
				}
				break;
			case 3:
				{
				setState(42);
				match(FORALL);
				setState(43);
				match(LPAREN);
				setState(44);
				variable();
				setState(45);
				match(RPAREN);
				setState(46);
				formula(4);
				}
				break;
			case 4:
				{
				setState(48);
				match(EXISTS);
				setState(49);
				match(LPAREN);
				setState(50);
				variable();
				setState(51);
				match(RPAREN);
				setState(52);
				formula(3);
				}
				break;
			case 5:
				{
				setState(54);
				pred_constant();
				setState(55);
				match(LPAREN);
				setState(56);
				term();
				setState(62);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__0) {
					{
					{
					setState(57);
					separator();
					setState(58);
					term();
					}
					}
					setState(64);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(65);
				match(RPAREN);
				}
				break;
			case 6:
				{
				setState(67);
				term();
				setState(68);
				match(EQUAL);
				setState(69);
				term();
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(79);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,4,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new FormulaContext(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_formula);
					setState(73);
					if (!(precpred(_ctx, 7))) throw new FailedPredicateException(this, "precpred(_ctx, 7)");
					setState(74);
					bin_connective();
					setState(75);
					formula(8);
					}
					} 
				}
				setState(81);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,4,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TermContext extends ParserRuleContext {
		public Ind_constantContext ind_constant() {
			return getRuleContext(Ind_constantContext.class,0);
		}
		public VariableContext variable() {
			return getRuleContext(VariableContext.class,0);
		}
		public Func_constantContext func_constant() {
			return getRuleContext(Func_constantContext.class,0);
		}
		public TerminalNode LPAREN() { return getToken(folParser.LPAREN, 0); }
		public List<TermContext> term() {
			return getRuleContexts(TermContext.class);
		}
		public TermContext term(int i) {
			return getRuleContext(TermContext.class,i);
		}
		public TerminalNode RPAREN() { return getToken(folParser.RPAREN, 0); }
		public List<SeparatorContext> separator() {
			return getRuleContexts(SeparatorContext.class);
		}
		public SeparatorContext separator(int i) {
			return getRuleContext(SeparatorContext.class,i);
		}
		public TermContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_term; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterTerm(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitTerm(this);
		}
	}

	public final TermContext term() throws RecognitionException {
		TermContext _localctx = new TermContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_term);
		int _la;
		try {
			setState(97);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(82);
				ind_constant();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(83);
				variable();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(84);
				func_constant();
				setState(85);
				match(LPAREN);
				setState(86);
				term();
				setState(92);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__0) {
					{
					{
					setState(87);
					separator();
					setState(88);
					term();
					}
					}
					setState(94);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(95);
				match(RPAREN);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Bin_connectiveContext extends ParserRuleContext {
		public TerminalNode CONJ() { return getToken(folParser.CONJ, 0); }
		public TerminalNode DISJ() { return getToken(folParser.DISJ, 0); }
		public TerminalNode IMPL() { return getToken(folParser.IMPL, 0); }
		public TerminalNode BICOND() { return getToken(folParser.BICOND, 0); }
		public Bin_connectiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bin_connective; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterBin_connective(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitBin_connective(this);
		}
	}

	public final Bin_connectiveContext bin_connective() throws RecognitionException {
		Bin_connectiveContext _localctx = new Bin_connectiveContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_bin_connective);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(99);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 15360L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class VariableContext extends ParserRuleContext {
		public TerminalNode LOWER_CONSTANT() { return getToken(folParser.LOWER_CONSTANT, 0); }
		public VariableContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_variable; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterVariable(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitVariable(this);
		}
	}

	public final VariableContext variable() throws RecognitionException {
		VariableContext _localctx = new VariableContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_variable);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(101);
			match(LOWER_CONSTANT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Pred_constantContext extends ParserRuleContext {
		public TerminalNode UPPER_CONSTANT() { return getToken(folParser.UPPER_CONSTANT, 0); }
		public Pred_constantContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pred_constant; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterPred_constant(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitPred_constant(this);
		}
	}

	public final Pred_constantContext pred_constant() throws RecognitionException {
		Pred_constantContext _localctx = new Pred_constantContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_pred_constant);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(103);
			match(UPPER_CONSTANT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Ind_constantContext extends ParserRuleContext {
		public TerminalNode LOWER_CONSTANT() { return getToken(folParser.LOWER_CONSTANT, 0); }
		public Ind_constantContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ind_constant; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterInd_constant(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitInd_constant(this);
		}
	}

	public final Ind_constantContext ind_constant() throws RecognitionException {
		Ind_constantContext _localctx = new Ind_constantContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_ind_constant);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(105);
			match(LOWER_CONSTANT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class Func_constantContext extends ParserRuleContext {
		public TerminalNode LOWER_CONSTANT() { return getToken(folParser.LOWER_CONSTANT, 0); }
		public Func_constantContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_func_constant; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterFunc_constant(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitFunc_constant(this);
		}
	}

	public final Func_constantContext func_constant() throws RecognitionException {
		Func_constantContext _localctx = new Func_constantContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_func_constant);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(107);
			match(LOWER_CONSTANT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SeparatorContext extends ParserRuleContext {
		public SeparatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_separator; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).enterSeparator(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof folListener ) ((folListener)listener).exitSeparator(this);
		}
	}

	public final SeparatorContext separator() throws RecognitionException {
		SeparatorContext _localctx = new SeparatorContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_separator);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(109);
			match(T__0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 1:
			return formula_sempred((FormulaContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean formula_sempred(FormulaContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 7);
		}
		return true;
	}

	public static final String _serializedATN =
		"\u0004\u0001\u000fp\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0001\u0000\u0001\u0000\u0001\u0000\u0005\u0000\u0016\b\u0000"+
		"\n\u0000\f\u0000\u0019\t\u0000\u0001\u0000\u0005\u0000\u001c\b\u0000\n"+
		"\u0000\f\u0000\u001f\t\u0000\u0001\u0000\u0001\u0000\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0005\u0001=\b\u0001\n\u0001\f\u0001@\t\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0003\u0001H\b"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0005\u0001N\b"+
		"\u0001\n\u0001\f\u0001Q\t\u0001\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0005\u0002[\b"+
		"\u0002\n\u0002\f\u0002^\t\u0002\u0001\u0002\u0001\u0002\u0003\u0002b\b"+
		"\u0002\u0001\u0003\u0001\u0003\u0001\u0004\u0001\u0004\u0001\u0005\u0001"+
		"\u0005\u0001\u0006\u0001\u0006\u0001\u0007\u0001\u0007\u0001\b\u0001\b"+
		"\u0001\b\u0000\u0001\u0002\t\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010"+
		"\u0000\u0001\u0001\u0000\n\rr\u0000\u0012\u0001\u0000\u0000\u0000\u0002"+
		"G\u0001\u0000\u0000\u0000\u0004a\u0001\u0000\u0000\u0000\u0006c\u0001"+
		"\u0000\u0000\u0000\be\u0001\u0000\u0000\u0000\ng\u0001\u0000\u0000\u0000"+
		"\fi\u0001\u0000\u0000\u0000\u000ek\u0001\u0000\u0000\u0000\u0010m\u0001"+
		"\u0000\u0000\u0000\u0012\u0017\u0003\u0002\u0001\u0000\u0013\u0014\u0005"+
		"\u000e\u0000\u0000\u0014\u0016\u0003\u0002\u0001\u0000\u0015\u0013\u0001"+
		"\u0000\u0000\u0000\u0016\u0019\u0001\u0000\u0000\u0000\u0017\u0015\u0001"+
		"\u0000\u0000\u0000\u0017\u0018\u0001\u0000\u0000\u0000\u0018\u001d\u0001"+
		"\u0000\u0000\u0000\u0019\u0017\u0001\u0000\u0000\u0000\u001a\u001c\u0005"+
		"\u000e\u0000\u0000\u001b\u001a\u0001\u0000\u0000\u0000\u001c\u001f\u0001"+
		"\u0000\u0000\u0000\u001d\u001b\u0001\u0000\u0000\u0000\u001d\u001e\u0001"+
		"\u0000\u0000\u0000\u001e \u0001\u0000\u0000\u0000\u001f\u001d\u0001\u0000"+
		"\u0000\u0000 !\u0005\u0000\u0000\u0001!\u0001\u0001\u0000\u0000\u0000"+
		"\"#\u0006\u0001\uffff\uffff\u0000#$\u0005\u0005\u0000\u0000$%\u0003\u0002"+
		"\u0001\u0000%&\u0003\u0006\u0003\u0000&\'\u0003\u0002\u0001\u0006\'H\u0001"+
		"\u0000\u0000\u0000()\u0005\u0005\u0000\u0000)H\u0003\u0002\u0001\u0005"+
		"*+\u0005\u0006\u0000\u0000+,\u0005\u0002\u0000\u0000,-\u0003\b\u0004\u0000"+
		"-.\u0005\u0003\u0000\u0000./\u0003\u0002\u0001\u0004/H\u0001\u0000\u0000"+
		"\u000001\u0005\u0007\u0000\u000012\u0005\u0002\u0000\u000023\u0003\b\u0004"+
		"\u000034\u0005\u0003\u0000\u000045\u0003\u0002\u0001\u00035H\u0001\u0000"+
		"\u0000\u000067\u0003\n\u0005\u000078\u0005\u0002\u0000\u00008>\u0003\u0004"+
		"\u0002\u00009:\u0003\u0010\b\u0000:;\u0003\u0004\u0002\u0000;=\u0001\u0000"+
		"\u0000\u0000<9\u0001\u0000\u0000\u0000=@\u0001\u0000\u0000\u0000><\u0001"+
		"\u0000\u0000\u0000>?\u0001\u0000\u0000\u0000?A\u0001\u0000\u0000\u0000"+
		"@>\u0001\u0000\u0000\u0000AB\u0005\u0003\u0000\u0000BH\u0001\u0000\u0000"+
		"\u0000CD\u0003\u0004\u0002\u0000DE\u0005\u0004\u0000\u0000EF\u0003\u0004"+
		"\u0002\u0000FH\u0001\u0000\u0000\u0000G\"\u0001\u0000\u0000\u0000G(\u0001"+
		"\u0000\u0000\u0000G*\u0001\u0000\u0000\u0000G0\u0001\u0000\u0000\u0000"+
		"G6\u0001\u0000\u0000\u0000GC\u0001\u0000\u0000\u0000HO\u0001\u0000\u0000"+
		"\u0000IJ\n\u0007\u0000\u0000JK\u0003\u0006\u0003\u0000KL\u0003\u0002\u0001"+
		"\bLN\u0001\u0000\u0000\u0000MI\u0001\u0000\u0000\u0000NQ\u0001\u0000\u0000"+
		"\u0000OM\u0001\u0000\u0000\u0000OP\u0001\u0000\u0000\u0000P\u0003\u0001"+
		"\u0000\u0000\u0000QO\u0001\u0000\u0000\u0000Rb\u0003\f\u0006\u0000Sb\u0003"+
		"\b\u0004\u0000TU\u0003\u000e\u0007\u0000UV\u0005\u0002\u0000\u0000V\\"+
		"\u0003\u0004\u0002\u0000WX\u0003\u0010\b\u0000XY\u0003\u0004\u0002\u0000"+
		"Y[\u0001\u0000\u0000\u0000ZW\u0001\u0000\u0000\u0000[^\u0001\u0000\u0000"+
		"\u0000\\Z\u0001\u0000\u0000\u0000\\]\u0001\u0000\u0000\u0000]_\u0001\u0000"+
		"\u0000\u0000^\\\u0001\u0000\u0000\u0000_`\u0005\u0003\u0000\u0000`b\u0001"+
		"\u0000\u0000\u0000aR\u0001\u0000\u0000\u0000aS\u0001\u0000\u0000\u0000"+
		"aT\u0001\u0000\u0000\u0000b\u0005\u0001\u0000\u0000\u0000cd\u0007\u0000"+
		"\u0000\u0000d\u0007\u0001\u0000\u0000\u0000ef\u0005\t\u0000\u0000f\t\u0001"+
		"\u0000\u0000\u0000gh\u0005\b\u0000\u0000h\u000b\u0001\u0000\u0000\u0000"+
		"ij\u0005\t\u0000\u0000j\r\u0001\u0000\u0000\u0000kl\u0005\t\u0000\u0000"+
		"l\u000f\u0001\u0000\u0000\u0000mn\u0005\u0001\u0000\u0000n\u0011\u0001"+
		"\u0000\u0000\u0000\u0007\u0017\u001d>GO\\a";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}