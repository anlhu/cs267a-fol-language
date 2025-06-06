/*
* based on FOL written for Antlr4 by Kamil Kapałka, with tweaks
*
*/

// $antlr-format alignTrailingComments true, columnLimit 150, minEmptyLines 1, maxEmptyLinesToKeep 1, reflowComments false, useTab false
// $antlr-format allowShortRulesOnASingleLine false, allowShortBlocksOnASingleLine true, alignSemicolons hanging, alignColons hanging

/* Human(socrates) 
forall(x) exists(y) Human(x) -> Father(y, x)
*/

grammar fol;

/*------------------------------------------------------------------
 * PARSER RULES
 *------------------------------------------------------------------*/

condition
    : formula (ENDLINE formula)* ENDLINE* EOF
    ;

formula
    : formula bin_connective formula
    | NOT formula bin_connective formula
    | NOT formula
    | FORALL LPAREN variable RPAREN formula
    | EXISTS LPAREN variable RPAREN formula
    | pred_constant LPAREN term (separator term)* RPAREN
    | term EQUAL term
    ;

term
    : ind_constant
    | variable
    | func_constant LPAREN term (separator term)* RPAREN
    ;

bin_connective
    : CONJ
    | DISJ
    | IMPL
    | BICOND
    ;

//used in FORALL|EXISTS and following predicates
variable
    : LOWER_CONSTANT
    ;

pred_constant
    : UPPER_CONSTANT
    ;

//individual constant - used in single predicates
ind_constant
    : LOWER_CONSTANT
    ;

//used to create functions, np. .presidentOf(?America) = #Trump
func_constant
    : LOWER_CONSTANT
    ;

/*------------------------------------------------------------------
 * LEXER RULES
 *------------------------------------------------------------------*/

LPAREN
    : '('
    ;

RPAREN
    : ')'
    ;

separator
    : ','
    ;

EQUAL
    : '=='
    ;

NOT
    : '!'
    ;

FORALL
    : 'forall'
    ;

EXISTS
    : 'exists'
    ;

//predicate constant - np. _isProfesor(?x)   
UPPER_CONSTANT
    : [A-Z] [a-zA-Z0-9]*
    ;

LOWER_CONSTANT
    : [a-z] [a-zA-Z0-9]*
    ;

CONJ
    : '&&'
    ;

DISJ
    : '||'
    ;

IMPL
    : '->'
    ;

BICOND
    : '<->'
    ;

ENDLINE
    : ('\r' | '\n')+
    ;

WHITESPACE
    : (' ' | '\t')+ -> skip
    ;