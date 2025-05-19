// Generated from fol.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue", "this-escape"})
public class folLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.13.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, LPAREN=2, RPAREN=3, EQUAL=4, NOT=5, FORALL=6, EXISTS=7, UPPER_CONSTANT=8, 
		LOWER_CONSTANT=9, CONJ=10, DISJ=11, IMPL=12, BICOND=13, ENDLINE=14, WHITESPACE=15;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"T__0", "LPAREN", "RPAREN", "EQUAL", "NOT", "FORALL", "EXISTS", "UPPER_CONSTANT", 
			"LOWER_CONSTANT", "CONJ", "DISJ", "IMPL", "BICOND", "ENDLINE", "WHITESPACE"
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


	public folLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "fol.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\u0004\u0000\u000f_\u0006\uffff\uffff\u0002\u0000\u0007\u0000\u0002\u0001"+
		"\u0007\u0001\u0002\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004"+
		"\u0007\u0004\u0002\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007"+
		"\u0007\u0007\u0002\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b"+
		"\u0007\u000b\u0002\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0001"+
		"\u0000\u0001\u0000\u0001\u0001\u0001\u0001\u0001\u0002\u0001\u0002\u0001"+
		"\u0003\u0001\u0003\u0001\u0003\u0001\u0004\u0001\u0004\u0001\u0005\u0001"+
		"\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001"+
		"\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001"+
		"\u0006\u0001\u0007\u0001\u0007\u0005\u0007;\b\u0007\n\u0007\f\u0007>\t"+
		"\u0007\u0001\b\u0001\b\u0005\bB\b\b\n\b\f\bE\t\b\u0001\t\u0001\t\u0001"+
		"\t\u0001\n\u0001\n\u0001\n\u0001\u000b\u0001\u000b\u0001\u000b\u0001\f"+
		"\u0001\f\u0001\f\u0001\f\u0001\r\u0004\rU\b\r\u000b\r\f\rV\u0001\u000e"+
		"\u0004\u000eZ\b\u000e\u000b\u000e\f\u000e[\u0001\u000e\u0001\u000e\u0000"+
		"\u0000\u000f\u0001\u0001\u0003\u0002\u0005\u0003\u0007\u0004\t\u0005\u000b"+
		"\u0006\r\u0007\u000f\b\u0011\t\u0013\n\u0015\u000b\u0017\f\u0019\r\u001b"+
		"\u000e\u001d\u000f\u0001\u0000\u0005\u0001\u0000AZ\u0003\u000009AZaz\u0001"+
		"\u0000az\u0002\u0000\n\n\r\r\u0002\u0000\t\t  b\u0000\u0001\u0001\u0000"+
		"\u0000\u0000\u0000\u0003\u0001\u0000\u0000\u0000\u0000\u0005\u0001\u0000"+
		"\u0000\u0000\u0000\u0007\u0001\u0000\u0000\u0000\u0000\t\u0001\u0000\u0000"+
		"\u0000\u0000\u000b\u0001\u0000\u0000\u0000\u0000\r\u0001\u0000\u0000\u0000"+
		"\u0000\u000f\u0001\u0000\u0000\u0000\u0000\u0011\u0001\u0000\u0000\u0000"+
		"\u0000\u0013\u0001\u0000\u0000\u0000\u0000\u0015\u0001\u0000\u0000\u0000"+
		"\u0000\u0017\u0001\u0000\u0000\u0000\u0000\u0019\u0001\u0000\u0000\u0000"+
		"\u0000\u001b\u0001\u0000\u0000\u0000\u0000\u001d\u0001\u0000\u0000\u0000"+
		"\u0001\u001f\u0001\u0000\u0000\u0000\u0003!\u0001\u0000\u0000\u0000\u0005"+
		"#\u0001\u0000\u0000\u0000\u0007%\u0001\u0000\u0000\u0000\t(\u0001\u0000"+
		"\u0000\u0000\u000b*\u0001\u0000\u0000\u0000\r1\u0001\u0000\u0000\u0000"+
		"\u000f8\u0001\u0000\u0000\u0000\u0011?\u0001\u0000\u0000\u0000\u0013F"+
		"\u0001\u0000\u0000\u0000\u0015I\u0001\u0000\u0000\u0000\u0017L\u0001\u0000"+
		"\u0000\u0000\u0019O\u0001\u0000\u0000\u0000\u001bT\u0001\u0000\u0000\u0000"+
		"\u001dY\u0001\u0000\u0000\u0000\u001f \u0005,\u0000\u0000 \u0002\u0001"+
		"\u0000\u0000\u0000!\"\u0005(\u0000\u0000\"\u0004\u0001\u0000\u0000\u0000"+
		"#$\u0005)\u0000\u0000$\u0006\u0001\u0000\u0000\u0000%&\u0005=\u0000\u0000"+
		"&\'\u0005=\u0000\u0000\'\b\u0001\u0000\u0000\u0000()\u0005!\u0000\u0000"+
		")\n\u0001\u0000\u0000\u0000*+\u0005f\u0000\u0000+,\u0005o\u0000\u0000"+
		",-\u0005r\u0000\u0000-.\u0005a\u0000\u0000./\u0005l\u0000\u0000/0\u0005"+
		"l\u0000\u00000\f\u0001\u0000\u0000\u000012\u0005e\u0000\u000023\u0005"+
		"x\u0000\u000034\u0005i\u0000\u000045\u0005s\u0000\u000056\u0005t\u0000"+
		"\u000067\u0005s\u0000\u00007\u000e\u0001\u0000\u0000\u00008<\u0007\u0000"+
		"\u0000\u00009;\u0007\u0001\u0000\u0000:9\u0001\u0000\u0000\u0000;>\u0001"+
		"\u0000\u0000\u0000<:\u0001\u0000\u0000\u0000<=\u0001\u0000\u0000\u0000"+
		"=\u0010\u0001\u0000\u0000\u0000><\u0001\u0000\u0000\u0000?C\u0007\u0002"+
		"\u0000\u0000@B\u0007\u0001\u0000\u0000A@\u0001\u0000\u0000\u0000BE\u0001"+
		"\u0000\u0000\u0000CA\u0001\u0000\u0000\u0000CD\u0001\u0000\u0000\u0000"+
		"D\u0012\u0001\u0000\u0000\u0000EC\u0001\u0000\u0000\u0000FG\u0005&\u0000"+
		"\u0000GH\u0005&\u0000\u0000H\u0014\u0001\u0000\u0000\u0000IJ\u0005|\u0000"+
		"\u0000JK\u0005|\u0000\u0000K\u0016\u0001\u0000\u0000\u0000LM\u0005-\u0000"+
		"\u0000MN\u0005>\u0000\u0000N\u0018\u0001\u0000\u0000\u0000OP\u0005<\u0000"+
		"\u0000PQ\u0005-\u0000\u0000QR\u0005>\u0000\u0000R\u001a\u0001\u0000\u0000"+
		"\u0000SU\u0007\u0003\u0000\u0000TS\u0001\u0000\u0000\u0000UV\u0001\u0000"+
		"\u0000\u0000VT\u0001\u0000\u0000\u0000VW\u0001\u0000\u0000\u0000W\u001c"+
		"\u0001\u0000\u0000\u0000XZ\u0007\u0004\u0000\u0000YX\u0001\u0000\u0000"+
		"\u0000Z[\u0001\u0000\u0000\u0000[Y\u0001\u0000\u0000\u0000[\\\u0001\u0000"+
		"\u0000\u0000\\]\u0001\u0000\u0000\u0000]^\u0006\u000e\u0000\u0000^\u001e"+
		"\u0001\u0000\u0000\u0000\u0005\u0000<CV[\u0001\u0006\u0000\u0000";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}